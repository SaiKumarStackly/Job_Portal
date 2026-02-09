# views.py (only user + profile)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    JobSeekerRegistrationSerializer,
    EmployerRegistrationSerializer,
    JobSeekerProfileReadSerializer,
    JobSeekerProfileWriteSerializer,
    EmployerProfileReadSerializer,
    EmployerProfileWriteSerializer,
    UserReadSerializer  ,
    JobApplicationDetailSerializer,
    NotificationSerializer ,CustomTokenObtainPairSerializer
)


class JobSeekerRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = JobSeekerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Jobseeker registered successfully",
                "user": UserReadSerializer(user).data  
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployerRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmployerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Employer registered successfully",
                "user": UserReadSerializer(user).data  
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                raise ValidationError("Refresh token is required.")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class JobSeekerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return JobSeekerProfileReadSerializer
        return JobSeekerProfileWriteSerializer

    def get_object(self):
        if not hasattr(self.request.user, 'jobseeker_profile'):
            raise ValidationError("You are not a jobseeker.")
        return self.request.user.jobseeker_profile


class EmployerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EmployerProfileReadSerializer
        return EmployerProfileWriteSerializer

    def get_object(self):
        if not hasattr(self.request.user, 'employer_profile'):
            raise ValidationError("You are not an employer.")
        return self.request.user.employer_profile
    

    
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Company, Job, JobApplication, SavedJob, Notification
from .serializers import (
    CompanySerializer, JobReadSerializer, JobWriteSerializer,
    JobApplicationWriteSerializer, SavedJobSerializer,
    JobApplicationEmployerSerializer, JobApplicationListSerializer ,JobUpdateSerializer
)



# Company Views

class CompanyListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CompanySerializer

    def get_queryset(self):
        # Public only sees active companies
        return Company.objects.filter(is_active=True)


class CompanyDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = CompanySerializer
    queryset = Company.objects.filter(is_active=True)


class CompanyCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CompanySerializer

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'employer_profile'):
            raise PermissionDenied("Only employers can create companies.")
        company = serializer.save()
        # Auto-link to employer profile
        employer_profile = self.request.user.employer_profile
        employer_profile.company = company
        employer_profile.save()


class CompanyLinkView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CompanySerializer

    def get_object(self):
        if not hasattr(self.request.user, 'employer_profile'):
            raise PermissionDenied("Only employers can link companies.")
        return self.request.user.employer_profile

    def perform_update(self, serializer):
        company_id = self.request.data.get('company_id')
        if not company_id:
            raise ValidationError({"company_id": "This field is required to link a company."})

        try:
            company = Company.objects.get(id=company_id, is_active=True)
        except Company.DoesNotExist:
            raise ValidationError({"company_id": "Company not found or inactive."})

        serializer.instance.company = company
        serializer.instance.save()


# Employer can edit their own company details


class CompanyEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CompanySerializer

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'employer_profile'):
            return Company.objects.none()
        # Only allow editing the company linked to this employer
        employer_company = user.employer_profile.company
        if not employer_company:
            return Company.objects.none()
        return Company.objects.filter(id=employer_company.id)

    def perform_update(self, serializer):
        # Optional: extra permission check (already handled by queryset)
        serializer.save()


# Admin: Disable/Enable Company
class AdminCompanyToggleActiveView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = CompanySerializer
    queryset = Company.objects.all()

    def perform_update(self, serializer):
        company = serializer.instance
        company.is_active = not company.is_active
        company.save()
        serializer.save()



# Job Views

class JobListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobReadSerializer

    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        # Filter by company if requested
        company_id = self.request.query_params.get('company')
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset


class JobDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobReadSerializer
    queryset = Job.objects.filter(is_active=True)


class JobCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobWriteSerializer

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'employer_profile'):
            raise PermissionDenied("Only employers can post jobs.")
        employer_profile = self.request.user.employer_profile
        if not employer_profile.company:
            raise PermissionDenied("You must link a company before posting jobs.")
        serializer.save(posted_by=self.request.user, company=employer_profile.company)


class JobUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobUpdateSerializer 

    def get_queryset(self):
        return Job.objects.filter(posted_by=self.request.user)


class JobDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobReadSerializer

    def get_queryset(self):
        return Job.objects.filter(posted_by=self.request.user)


class JobToggleActiveView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobWriteSerializer

    def get_queryset(self):
        return Job.objects.filter(posted_by=self.request.user)

    def perform_update(self, serializer):
        job = serializer.instance
        job.is_active = not job.is_active
        job.save()
        serializer.save()


# Job Application & Saved Jobs

class ApplyJobView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationWriteSerializer  # keep this for validation/input

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        # Notify the employer 
        job = instance.job
        if job.posted_by and hasattr(job.posted_by, 'employer_profile'):
            Notification.objects.create(
                user=job.posted_by,
                message=f"New application received for '{job.title}' from {request.user.email}"
            )

        # Use the FULL detail serializer for response
        detail_serializer = JobApplicationDetailSerializer(instance)
        headers = self.get_success_headers(serializer.data)
        
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AppliedJobsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationListSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)


class SaveJobView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SavedJobSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavedJobsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SavedJobSerializer

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)

class WithdrawApplicationView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationDetailSerializer  # ← use full serializer
    queryset = JobApplication.objects.all()

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        application = serializer.instance
        if application.status == JobApplication.Status.WITHDRAWN:
            raise ValidationError("Application is already withdrawn.")
        
        application.status = JobApplication.Status.WITHDRAWN
        application.save()
        
        # Return full updated details
        return Response(JobApplicationDetailSerializer(application).data)

# Employer: Applications for their jobs

class EmployerApplicationsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationEmployerSerializer

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'employer_profile'):
            return JobApplication.objects.none()
        # Jobs posted by this employer
        jobs = Job.objects.filter(posted_by=user)
        return JobApplication.objects.filter(job__in=jobs)
    
# Employer: Change application status
class EmployerApplicationStatusUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationEmployerSerializer

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'employer_profile'):
            return JobApplication.objects.none()
        
        employer_company = user.employer_profile.company
        if not employer_company:
            return JobApplication.objects.none()
        
        # All applications for jobs in this company
        jobs = Job.objects.filter(company=employer_company)
        return JobApplication.objects.filter(job__in=jobs)

    def perform_update(self, serializer):
        application = serializer.instance
        old_status = application.status
        
        # Get new status from request data
        new_status = self.request.data.get('status')
        if not new_status:
            raise ValidationError({"status": "This field is required to update status."})
        
        if new_status not in [choice[0] for choice in JobApplication.Status.choices]:
            raise ValidationError({"status": f"Invalid status. Valid choices: {', '.join([c[0] for c in JobApplication.Status.choices])}"})
        
        # Prevent changing to same status (optional)
        if new_status == old_status:
            raise ValidationError({"status": "Application is already in this status."})
        
        # Update status
        application.status = new_status
        application.save()

        # Create notification for jobseeker
        Notification.objects.create(
            user=application.user,
            message=f"Your application for '{application.job.title}' has been updated to: {new_status.replace('_', ' ').title()}"
        )

        # Return full updated application
        return Response(JobApplicationEmployerSerializer(application).data)

# Notifications


class NotificationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class MarkNotificationReadView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.instance.is_read = True
        serializer.instance.save()