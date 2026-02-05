from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid


class User(AbstractUser):
    class UserType(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        EMPLOYER = 'employer', 'Employer'
        JOBSEEKER = 'jobseeker', 'Jobseeker'

    user_type = models.CharField(max_length=10, choices=UserType.choices, default=UserType.JOBSEEKER)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']

    def __str__(self):
        return f"{self.username} ({self.user_type})"



#PROFILES


class JobSeekerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='jobseeker_profile')

    # Basic Profile
    full_name = models.CharField(max_length=200, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=(('Male', 'Male'), ('Female', 'Female'), ('Not Specified', 'Not Specified')),
        blank=True
    )
    dob = models.DateField(null=True, blank=True)
    marital_status = models.CharField(
        max_length=20,
        choices=(('Single', 'Single'), ('Married', 'Married')),
        blank=True
    )
    nationality = models.CharField(max_length=100, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)

    # Current / Professional Details (general fields only)
    current_job_title = models.CharField(max_length=200, blank=True)
    current_company = models.CharField(max_length=200, blank=True)
    total_experience_years = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    notice_period = models.CharField(
        max_length=50,
        choices=(
            ('Immediate', 'Immediate'),
            ('1 Month', '1 Month'),
            ('2 Months', '2 Months'),
            ('3 Months', '3 Months'),
        ),
        blank=True
    )
    current_location = models.CharField(max_length=200, blank=True)
    preferred_locations = models.TextField(blank=True)  # comma separated or JSON later

    # Contact Details
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    alternate_email = models.EmailField(blank=True, null=True)
    full_address = models.TextField(blank=True)
    street = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Resume & Portfolio
    resume_file = models.FileField(upload_to='resumes/', null=True, blank=True)
    portfolio_link = models.URLField(blank=True, null=True)

    # Career Preferences
    current_ctc = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    expected_ctc = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    preferred_job_type = models.CharField(
        max_length=50,
        choices=(
            ('Full-time', 'Full-time'),
            ('Part-time', 'Part-time'),
            ('Internship', 'Internship'),
            ('Contract', 'Contract'),
        ),
        blank=True
    )
    preferred_role_industry = models.CharField(max_length=200, blank=True)
    ready_to_start_immediately = models.BooleanField(default=False)
    willing_to_relocate = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Job Seeker: {self.user.email}"





class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')

    department = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    access_level = models.CharField(max_length=50, default='Full')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Admin: {self.user.email}"


#JOB SEEKER RELATED DETAIL MODELS


class EducationEntry(models.Model):
    class QualificationLevel(models.TextChoices):
        SSLC = 'SSLC', 'SSLC'
        HSC = 'HSC', 'HSC'
        DIPLOMA = 'Diploma', 'Diploma'
        GRADUATION = 'Graduation', 'Graduation'
        POST_GRADUATION = 'Post-Graduation', 'Post-Graduation'
        DOCTORATE = 'Doctorate', 'Doctorate'

    class Post10thStudy(models.TextChoices):
        INTERMEDIATE = 'Intermediate', 'Intermediate/12th'
        DIPLOMA = 'Diploma', 'Diploma'

    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name='educations')

    qualification_level = models.CharField(
        max_length=30,
        choices=QualificationLevel.choices
    )

    # Common fields
    institution = models.CharField(max_length=200)
    percentage_or_cgpa = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # SSLC / HSC
    location = models.CharField(max_length=200, blank=True)

    # HSC specific
    post_10th_study = models.CharField(
        max_length=20,
        choices=Post10thStudy.choices,
        blank=True,
        null=True
    )

    # Graduation / Post-Grad / Doctorate specific
    degree = models.CharField(max_length=200, blank=True, null=True)
    department = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=(('Completed', 'Completed'), ('Pursuing', 'Pursuing')),
        blank=True,
        null=True
    )
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    # Date fields - different depending on level
    completion_year = models.DateField(
        null=True,
        blank=True,
        help_text="Used for SSLC, HSC, Diploma - year of completion"
    )

    start_year = models.DateField(
        null=True,
        blank=True,
        help_text="Used for Graduation, Post-Graduation, Doctorate"
    )

    end_year = models.DateField(
        null=True,
        blank=True,
        help_text="Used for Graduation, Post-Graduation, Doctorate"
    )

    class Meta:
        ordering = ['-end_year', '-completion_year', '-start_year']

    def __str__(self):
        return f"{self.qualification_level} - {self.institution}"


class WorkExperienceEntry(models.Model):
    class CurrentStatus(models.TextChoices):
        FRESHER = 'Fresher', 'Fresher'
        EXPERIENCED = 'Experienced', 'Experienced'

    class YesNo(models.TextChoices):
        YES = 'Yes', 'Yes'
        NO = 'No', 'No'

    class IndustryDomain(models.TextChoices):
        IT_SOFTWARE = 'IT-Software', 'IT-Software'
        FINANCE = 'Finance', 'Finance'
        HEALTHCARE = 'Healthcare', 'Healthcare'
        EDUCATION = 'Education', 'Education'
        MANUFACTURING = 'Manufacturing', 'Manufacturing'
        MARKETING = 'Marketing', 'Marketing'
        RETAIL = 'Retail', 'Retail'
        OTHER = 'Other', 'Other'

    class JobType(models.TextChoices):
        FULL_TIME = 'Full-time', 'Full-time'
        PART_TIME = 'Part-time', 'Part-time'
        CONTRACT = 'Contract', 'Contract'
        INTERNSHIP = 'Internship', 'Internship'

    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name='experiences')

    # Status & internship 
    current_status = models.CharField(
        max_length=20,
        choices=CurrentStatus.choices,
        default=CurrentStatus.FRESHER
    )
    has_internship_experience = models.CharField(
        max_length=3,
        choices=YesNo.choices,
        blank=True,
        help_text="Only relevant if current_status is Fresher"
    )

    # Experience details
    job_title = models.CharField(max_length=200, blank=True)
    company_name = models.CharField(max_length=200, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    currently_working = models.BooleanField(default=False)  # If True → end_date optional
    industry_domain = models.CharField(max_length=50, choices=IndustryDomain.choices, blank=True)
    job_type = models.CharField(max_length=50, choices=JobType.choices, blank=True)
    location = models.CharField(max_length=200, blank=True)
    key_responsibilities = models.TextField(blank=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        if self.current_status == self.CurrentStatus.FRESHER:
            return f"Fresher (Internship: {self.has_internship_experience})"
        return f"{self.job_title} @ {self.company_name}"


class Skill(models.Model):
    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ['profile', 'name']

    def __str__(self):
        return self.name


class LanguageKnown(models.Model):
    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name='languages')
    name = models.CharField(max_length=100)
    proficiency = models.CharField(
        max_length=50,
        choices=(
            ('Beginner', 'Beginner'),
            ('Intermediate', 'Intermediate'),
            ('Fluent', 'Fluent'),
            ('Native', 'Native'),
        )
    )

    class Meta:
        unique_together = ['profile', 'name']

    def __str__(self):
        return f"{self.name} ({self.proficiency})"


class Certification(models.Model):
    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name='certifications')
    name = models.CharField(max_length=200)
    certificate_file = models.FileField(upload_to='certificates/', null=True, blank=True)

    def __str__(self):
        return self.name


#JOBS & APPLICATIONS


class Company(models.Model):
    custom_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        help_text="Custom ID like CMP-001, STA001 (auto-generated if empty)"
    )
    name = models.CharField(max_length=200, unique=True)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    slogan = models.CharField(max_length=200, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    review_count = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=150, blank=True)
    employee_count = models.IntegerField(null=True, blank=True)
    founded_year = models.PositiveIntegerField(null=True, blank=True)
    company_address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True, help_text="Admin can disable company")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.custom_id:
            # Auto-generate custom ID (CMP-001, CMP-002, ...)
            last = Company.objects.order_by('id').last()
            next_num = 1 if not last or not last.custom_id else int(last.custom_id.split('-')[-1]) + 1
            self.custom_id = f"CMP-{next_num:03d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.custom_id})"


# EmployerProfile — clean & minimal
class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')

    full_name = models.CharField(max_length=200, blank=True)           # ← personal name
    employee_id = models.CharField(max_length=50, blank=True, unique=True,   null=True,)  # ← optional staff ID

    company = models.ForeignKey(
        'Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='employers'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        company_str = self.company.name if self.company else "No Company"
        return f"Employer: {self.full_name or self.user.email} - {company_str}"


class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = 'Full-time', 'Full-time'
        PART_TIME = 'Part-time', 'Part-time'
        INTERNSHIP = 'Internship', 'Internship'
        CONTRACT = 'Contract', 'Contract'

    class IndustryType(models.TextChoices):
        IT_SOFTWARE = 'IT-Software', 'IT-Software'
        FINANCE = 'Finance', 'Finance'
        HEALTHCARE = 'Healthcare', 'Healthcare'
        EDUCATION = 'Education', 'Education'
        MANUFACTURING = 'Manufacturing', 'Manufacturing'
        MARKETING = 'Marketing', 'Marketing'
        RETAIL = 'Retail', 'Retail'
        OTHER = 'Other', 'Other'

    class ExperienceRequired(models.TextChoices):
        FRESHER = 'Fresher', 'Fresher'
        ZERO_TO_ONE = '0-1 Years', '0-1 Years'
        ONE_TO_THREE = '1-3 Years', '1-3 Years'
        THREE_TO_FIVE = '3-5 Years', '3-5 Years'
        FIVE_PLUS = '5+ Years', '5+ Years'

    class WorkType(models.TextChoices):
        ON_SITE = 'On-site', 'On-site'
        REMOTE = 'Remote', 'Remote'
        HYBRID = 'Hybrid', 'Hybrid'

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=20, choices=JobType.choices, blank=True)
    industry_type = models.CharField(max_length=20, choices=IndustryType.choices, blank=True)
    experience_required = models.CharField(max_length=20, choices=ExperienceRequired.choices, blank=True)
    work_type = models.CharField(max_length=20, choices=WorkType.choices, blank=True)
    salary = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    responsibilities = models.JSONField(default=list, blank=True)
    key_skills = models.JSONField(default=list, blank=True)
    education_required = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    department = models.JSONField(default=list, blank=True)
    shift = models.CharField(max_length=50, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    openings = models.IntegerField(default=1)
    applicants_count = models.IntegerField(default=0)
    posted_date = models.DateTimeField(default=timezone.now)
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='posted_jobs')
    is_active = models.BooleanField(default=True, help_text="Whether this job is currently active and visible")

    def __str__(self):
        return f"{self.title} - {self.company.name}"


class JobApplication(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'applied', 'Applied'
        SHORTLISTED = 'shortlisted', 'Shortlisted'
        INTERVIEW = 'interview', 'Interview Stage'
        OFFERED = 'offered', 'Offered'
        REJECTED = 'rejected', 'Rejected'
        HIRED = 'hired', 'Hired'
        WITHDRAWN = 'withdrawn', 'Withdrawn'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applied_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.APPLIED)
    cover_letter = models.TextField(blank=True, null=True)
    resume_version = models.FileField(upload_to='application_resumes/', null=True, blank=True)

    class Meta:
        unique_together = ['user', 'job']

    def __str__(self):
        return f"{self.user.email} → {self.job.title}"


class SavedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    saved_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'job']

    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"



#OTHER MODELS


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.message[:40]}"