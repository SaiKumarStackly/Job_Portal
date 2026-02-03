from rest_framework import serializers
from django.core.exceptions import ValidationError
from drf_writable_nested.serializers import WritableNestedModelSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import (
    User, JobSeekerProfile, EmployerProfile, AdminProfile,
    EducationEntry, WorkExperienceEntry, Skill, LanguageKnown, Certification,
    Company, Job, JobApplication, SavedJob,
    NewsletterSubscriber, Notification
)

User = get_user_model()


# ────────────────────────────────────────────────
# User Serializers
# ────────────────────────────────────────────────

class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'user_type', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'user_type']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data.get('phone')
        )
        return user


class JobSeekerRegistrationSerializer(UserRegistrationSerializer):
    class Meta(UserRegistrationSerializer.Meta):
        fields = UserRegistrationSerializer.Meta.fields

    def create(self, validated_data):
        validated_data['user_type'] = User.UserType.JOBSEEKER
        user = super().create(validated_data)
        JobSeekerProfile.objects.create(user=user)
        return user


class EmployerRegistrationSerializer(UserRegistrationSerializer):
    company_name = serializers.CharField(max_length=200, required=True)

    class Meta(UserRegistrationSerializer.Meta):
        fields = UserRegistrationSerializer.Meta.fields + ['company_name']

    def create(self, validated_data):
        company_name = validated_data.pop('company_name')
        validated_data['user_type'] = User.UserType.EMPLOYER
        user = super().create(validated_data)
        EmployerProfile.objects.create(user=user, company_name=company_name)
        return user


# ────────────────────────────────────────────────
# Child Model Serializers
# ────────────────────────────────────────────────

class EducationEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationEntry
        fields = '__all__'
        read_only_fields = ['id', 'profile']

    def validate(self, data):
        level = data.get('qualification_level')
        errors = {}

        if not data.get('institution'):
            errors['institution'] = "Institution name is required."

        if level in ['SSLC', 'HSC', 'Diploma']:
            if not data.get('completion_year'):
                errors['completion_year'] = "Year of completion is required for this level."
            if data.get('start_year') or data.get('end_year'):
                errors['start_year'] = "Start/end year not allowed for SSLC/HSC/Diploma."

        if level in ['Graduation', 'Post-Graduation', 'Doctorate']:
            if not data.get('start_year'):
                errors['start_year'] = "Start year is required for Graduation+ levels."
            if not data.get('end_year'):
                errors['end_year'] = "End year is required for Graduation+ levels."
            if data.get('completion_year'):
                errors['completion_year'] = "Completion year not allowed for Graduation+ levels."

        if level == 'HSC' and not data.get('post_10th_study'):
            errors['post_10th_study'] = "Please select what you studied after 10th."

        if level in ['Graduation', 'Post-Graduation'] and not data.get('degree'):
            errors['degree'] = "Degree is required for Graduation/Post-Graduation."

        if errors:
            raise serializers.ValidationError(errors)

        return data


class WorkExperienceEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperienceEntry
        fields = '__all__'
        read_only_fields = ['id', 'profile']

    def validate(self, data):
        errors = {}

        if data.get('current_status') == WorkExperienceEntry.CurrentStatus.EXPERIENCED:
            if not data.get('job_title'):
                errors['job_title'] = "Job title is required when status is Experienced."
            if not data.get('company_name'):
                errors['company_name'] = "Company name is required when status is Experienced."

        if data.get('currently_working') and data.get('end_date'):
            errors['end_date'] = "End date should be empty if currently working."

        if errors:
            raise serializers.ValidationError(errors)

        return data


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']
        read_only_fields = ['id', 'profile']


class LanguageKnownSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageKnown
        fields = ['id', 'name', 'proficiency']
        read_only_fields = ['id', 'profile']


class CertificationSerializer(serializers.ModelSerializer):
    certificate_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Certification
        fields = ['id', 'name', 'certificate_file', 'certificate_url']
        read_only_fields = ['id', 'profile']

    def get_certificate_url(self, obj):
        return obj.certificate_file.url if obj.certificate_file else None


# ────────────────────────────────────────────────
# Profile Serializers
# ────────────────────────────────────────────────

class JobSeekerProfileReadSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)
    profile_photo_url = serializers.SerializerMethodField()
    resume_url = serializers.SerializerMethodField()
    educations = EducationEntrySerializer(many=True, read_only=True)
    experiences = WorkExperienceEntrySerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    languages = LanguageKnownSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)

    class Meta:
        model = JobSeekerProfile
        fields = '__all__'

    def get_profile_photo_url(self, obj):
        return obj.profile_photo.url if obj.profile_photo else None

    def get_resume_url(self, obj):
        return obj.resume_file.url if obj.resume_file else None


class JobSeekerProfileWriteSerializer(WritableNestedModelSerializer):
    educations = EducationEntrySerializer(many=True, required=False)
    experiences = WorkExperienceEntrySerializer(many=True, required=False)
    skills = SkillSerializer(many=True, required=False)
    languages = LanguageKnownSerializer(many=True, required=False)
    certifications = CertificationSerializer(many=True, required=False)

    class Meta:
        model = JobSeekerProfile
        exclude = ['id', 'user', 'created_at', 'updated_at']

    def validate(self, data):
        if data.get('dob') and data['dob'] > timezone.now().date():
            raise serializers.ValidationError({"dob": "Date of birth cannot be in the future."})
        return data


class EmployerProfileReadSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = EmployerProfile
        fields = '__all__'

    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else None


class EmployerProfileWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        exclude = ['id', 'user', 'company_id', 'created_at', 'updated_at', 'ratings', 'review_count']

    def validate(self, data):
        if 'company_name' in data and (not data['company_name'] or not data['company_name'].strip()):
            raise serializers.ValidationError({"company_name": "Company name is required and cannot be empty."})
        return data


class AdminProfileReadSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)

    class Meta:
        model = AdminProfile
        fields = '__all__'


class AdminProfileWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        exclude = ['id', 'user', 'created_at', 'updated_at']


# ────────────────────────────────────────────────
# Company & Job Serializers
# ────────────────────────────────────────────────

class CompanySerializer(serializers.ModelSerializer):
    companyName = serializers.CharField(source='name')
    companyId = serializers.CharField(source='id', read_only=True)
    TopCompany = serializers.SerializerMethodField(read_only=True)
    logo_url = serializers.SerializerMethodField(read_only=True)
    reviewNo = serializers.IntegerField(source='review_count', read_only=True)

    class Meta:
        model = Company
        fields = [
            'companyId', 'companyName', 'logo', 'logo_url',
            'TopCompany', 'slogan', 'ratings', 'reviewNo',
            'description', 'website'
        ]

    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else ""

    def get_TopCompany(self, obj):
        return obj.rating >= 4.0  # Customize as needed


class JobReadSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    companyId = serializers.CharField(source='company.id', read_only=True)
    logo = serializers.ImageField(source='company.logo', read_only=True)
    PostedBy = serializers.CharField(source='posted_by.username', default='Company Jobs', read_only=True)
    IndustryType = serializers.JSONField(source='industry_type')
    Department = serializers.JSONField(source='department')
    WorkType = serializers.CharField(source='work_type')
    ratings = serializers.FloatField(source='company.rating', read_only=True)
    reviewNo = serializers.IntegerField(source='company.review_count', read_only=True)
    applicants = serializers.IntegerField(source='applicants_count', read_only=True)
    JobHighlights = serializers.JSONField(source='job_highlights', default=list)
    companyOverview = serializers.CharField(source='company.description', default='', read_only=True)
    jobDescription = serializers.CharField(source='description')
    Responsibilities = serializers.JSONField(source='responsibilities', default=list)
    EducationRequired = serializers.JSONField(source='education_required', default=list)
    KeySkills = serializers.JSONField(source='key_skills', default=list)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'companyId', 'logo', 'posted', 'PostedBy',
            'IndustryType', 'Department', 'WorkType', 'shift', 'duration',
            'ratings', 'reviewNo', 'salary', 'experience_required', 'location',
            'openings', 'applicants', 'tags', 'EducationRequired', 'KeySkills',
            'JobHighlights', 'companyOverview', 'jobDescription', 'Responsibilities'
        ]


class JobWriteSerializer(serializers.ModelSerializer):
    companyName = serializers.CharField(write_only=True, required=False)
    companyId = serializers.CharField(write_only=True, required=False)
    logo = serializers.ImageField(source='company.logo', write_only=True, required=False)

    IndustryType = serializers.JSONField(source='industry_type', write_only=True)
    Department = serializers.JSONField(source='department', write_only=True)
    WorkType = serializers.CharField(source='work_type', write_only=True)
    JobHighlights = serializers.JSONField(source='job_highlights', write_only=True)
    companyOverview = serializers.CharField(source='company.description', write_only=True, required=False)
    jobDescription = serializers.CharField(source='description', write_only=True)
    Responsibilities = serializers.JSONField(source='responsibilities', write_only=True)
    EducationRequired = serializers.JSONField(source='education_required', write_only=True)
    KeySkills = serializers.JSONField(source='key_skills', write_only=True)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'posted_date', 'posted_by', 'applicants_count']

    def validate(self, data):
        if not data.get('company') and not (data.get('companyName') or data.get('companyId')):
            raise serializers.ValidationError({"companyName": "Company name or company ID is required."})
        return data

    def create(self, validated_data):
        company_name = validated_data.pop('companyName', None)
        company_id = validated_data.pop('companyId', None)
        logo = validated_data.pop('logo', None)

        company = None
        if company_name or company_id:
            company, _ = Company.objects.get_or_create(
                name=company_name or company_id,
                defaults={
                    'description': validated_data.pop('companyOverview', ''),
                    'logo': logo,
                }
            )

        validated_data['company'] = company
        validated_data['posted_by'] = self.context['request'].user
        return super().create(validated_data)


# ────────────────────────────────────────────────
# Job Application & Saved Job
# ────────────────────────────────────────────────

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['id', 'applied_date', 'user']


class SavedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJob
        fields = '__all__'
        read_only_fields = ['id', 'saved_date', 'user']


# ────────────────────────────────────────────────
# Other Models
# ────────────────────────────────────────────────

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'
        read_only_fields = ['subscribed_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'user']