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
    UserReadSerializer  # Changed to UserReadSerializer to match your file
)


class JobSeekerRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = JobSeekerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Jobseeker registered successfully",
                "user": UserReadSerializer(user).data  # Changed to UserReadSerializer
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
                "user": UserReadSerializer(user).data  # Changed to UserReadSerializer
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]


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