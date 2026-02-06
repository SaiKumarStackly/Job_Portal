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

# User Serializers

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


# Employer Registration — no company_name, no full_name
class EmployerRegistrationSerializer(UserRegistrationSerializer):
    class Meta(UserRegistrationSerializer.Meta):
        fields = UserRegistrationSerializer.Meta.fields

    def create(self, validated_data):
        validated_data['user_type'] = User.UserType.EMPLOYER
        user = super().create(validated_data)
        EmployerProfile.objects.create(user=user)
        return user


# Child Model Serializers

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


# Profile Serializers

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





class AdminProfileReadSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)

    class Meta:
        model = AdminProfile
        fields = '__all__'


class AdminProfileWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        exclude = ['id', 'user', 'created_at', 'updated_at']


# Company Serializer — full & supports create/update/disable
class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField(read_only=True)
    custom_id = serializers.CharField(read_only=True)  # auto-generated

    class Meta:
        model = Company
        fields = [
            'id', 'custom_id', 'name', 'logo', 'logo_url',
            'slogan', 'rating', 'review_count',
            'company_overview', 'website', 'industry',
            'employee_count', 'founded_year', 'company_address',
            'is_active'
        ]
        read_only_fields = ['id', 'custom_id', 'rating', 'review_count', 'is_active']

    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else None



# EmployerProfile Read Serializer
class EmployerProfileReadSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)
    company = CompanySerializer(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = ['id', 'user', 'full_name', 'employee_id', 'company', 'created_at', 'updated_at']


# EmployerProfile Write Serializer 
class EmployerProfileWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['full_name', 'employee_id', 'company']

    def validate_employee_id(self, value):
        if not value:
            return None

        qs = EmployerProfile.objects.filter(employee_id=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.exists():
            raise serializers.ValidationError("This Employee ID is already in use.")

        return value


    def validate_company(self, value):
        if value and not value.is_active:
            raise serializers.ValidationError("Cannot link to an inactive company.")
        return value


# Job Read Serializer 
class JobReadSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    posted_by = serializers.CharField(source='posted_by.username', read_only=True, default='Company Jobs')

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'location',
            'job_type', 'industry_type', 'experience_required', 'work_type',
            'salary', 'description', 'responsibilities', 'job_highlights', 'key_skills',
            'education_required', 'tags', 'department', 'shift', 'duration',
            'openings', 'applicants_count', 'posted_date', 'posted_by',
            'is_active'
        ]

# Job Serializer for CREATE (full validation)
class JobWriteSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    posted_by = serializers.CharField(source='posted_by.username', read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'location',
            'job_type', 'industry_type', 'experience_required', 'work_type',
            'salary', 'description', 'responsibilities','job_highlights','key_skills',
            'education_required', 'tags', 'department', 'shift', 'duration',
            'openings', 'applicants_count', 'posted_date', 'posted_by',
            'is_active'
        ]
        read_only_fields = ['id', 'company', 'posted_date', 'posted_by', 'applicants_count']

    def validate(self, data):
        user = self.context['request'].user
        if not hasattr(user, 'employer_profile'):
            raise serializers.ValidationError("Only employers can create/update jobs.")
        
        employer_profile = user.employer_profile
        if not employer_profile.company:
            raise serializers.ValidationError(
                "You must create or link a company in your profile before posting jobs."
            )

        # For CREATE: title must be unique per company
        title = data.get('title')
        if title and Job.objects.filter(
            company=employer_profile.company,
            title__iexact=title
        ).exists():
            raise serializers.ValidationError(
                {"title": f"A job with title '{title}' already exists for this company."}
            )

        return data

    def create(self, validated_data):
        validated_data['posted_by'] = self.context['request'].user
        employer_profile = self.context['request'].user.employer_profile
        validated_data['company'] = employer_profile.company
        return super().create(validated_data)


# NEW: Separate serializer for UPDATE (PATCH/PUT) - fields optional
class JobUpdateSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    posted_by = serializers.CharField(source='posted_by.username', read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'location',
            'job_type', 'industry_type', 'experience_required', 'work_type',
            'salary', 'description', 'responsibilities', 'key_skills',
            'education_required', 'tags', 'department', 'shift', 'duration',
            'openings', 'applicants_count', 'posted_date', 'posted_by',
            'is_active'
        ]
        read_only_fields = ['id', 'company', 'posted_date', 'posted_by', 'applicants_count']

    def validate(self, data):
        user = self.context['request'].user
        if not hasattr(user, 'employer_profile'):
            raise serializers.ValidationError("Only employers can update jobs.")
        
        # Optional: only check title uniqueness if title is being changed
        title = data.get('title')
        if title:
            instance = self.instance
            if Job.objects.filter(
                company=instance.company,
                title__iexact=title
            ).exclude(id=instance.id).exists():
                raise serializers.ValidationError(
                    {"title": f"A job with title '{title}' already exists for this company."}
                )

        return data

# JobApplication & SavedJob 
class JobApplicationWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['job', 'cover_letter']
        read_only_fields = ['id', 'applied_date', 'user', 'status', 'resume_version']

    def validate(self, data):
        if not hasattr(self.context['request'].user, 'jobseeker_profile'):
            raise serializers.ValidationError("Only jobseekers can apply.")

        user = self.context['request'].user
        job = data.get('job')

        # Check if there is already an ACTIVE application
        active_statuses = [
            JobApplication.Status.APPLIED,
            JobApplication.Status.RESUME_SCREENING,
            JobApplication.Status.RECRUITER_REVIEW,
            JobApplication.Status.SHORTLISTED,
            JobApplication.Status.INTERVIEW_CALLED,
            JobApplication.Status.OFFERED,
            JobApplication.Status.HIRED
        ]

        if JobApplication.objects.filter(
            user=user,
            job=job,
            status__in=active_statuses
        ).exists():
            raise serializers.ValidationError(
                "You already have an active application for this job. "
                "Please wait for a response or withdraw the existing one."
            )

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['status'] = JobApplication.Status.APPLIED
        profile = self.context['request'].user.jobseeker_profile
        if profile.resume_file:
            validated_data['resume_version'] = profile.resume_file
        return super().create(validated_data)

# NEW: Full read serializer for JobApplication (used after create)
class JobApplicationDetailSerializer(serializers.ModelSerializer):
    job = JobReadSerializer(read_only=True)
    user = UserReadSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'user', 'applied_date', 'status',
            'cover_letter', 'resume_version'
        ]
        read_only_fields = ['id', 'applied_date', 'user', 'status']


class SavedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJob
        fields = ['job']
        read_only_fields = ['id', 'saved_date', 'user']

class JobApplicationListSerializer(serializers.ModelSerializer):
    job = JobReadSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'applied_date', 'status', 'cover_letter']
        read_only_fields = ['id', 'applied_date', 'status']


class JobApplicationEmployerSerializer(serializers.ModelSerializer):
    job = JobReadSerializer(read_only=True)
    user = UserReadSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'user', 'applied_date', 'status', 'cover_letter']
        read_only_fields = ['id', 'applied_date']

# Other Models


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