from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    JobSeekerRegistrationView,
    EmployerRegistrationView,
    LoginView,
    LogoutView,
    JobSeekerProfileView,
    EmployerProfileView,
)

 

urlpatterns = [
    # Registration (open to everyone)
    path('register/jobseeker/', JobSeekerRegistrationView.as_view(), name='jobseeker-register'),
    path('register/employer/', EmployerRegistrationView.as_view(), name='employer-register'),

    # JWT Auth
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Profile (only authenticated users)
    path('profile/jobseeker/', JobSeekerProfileView.as_view(), name='jobseeker-profile'),
    path('profile/employer/', EmployerProfileView.as_view(), name='employer-profile'),
]