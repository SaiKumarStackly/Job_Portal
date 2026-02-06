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
from . import views
 

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

    # Companies
    path('companies/', views.CompanyListView.as_view(), name='company-list'),
    path('companies/<int:pk>/', views.CompanyDetailView.as_view(), name='company-detail'),
    path('companies/create/', views.CompanyCreateView.as_view(), name='company-create'),
    path('companies/link/', views.CompanyLinkView.as_view(), name='company-link'),  # PATCH to link existing
    path('companies/<int:pk>/edit/', views.CompanyEditView.as_view(), name='company-edit'),
    path('admin/companies/<int:pk>/toggle-active/', views.AdminCompanyToggleActiveView.as_view(), name='admin-company-toggle'),

    # Jobs
    path('jobs/', views.JobListView.as_view(), name='job-list'),
    path('jobs/<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('jobs/create/', views.JobCreateView.as_view(), name='job-create'),
    path('jobs/<int:pk>/update/', views.JobUpdateView.as_view(), name='job-update'),
    path('jobs/<int:pk>/delete/', views.JobDeleteView.as_view(), name='job-delete'),
    path('jobs/<int:pk>/toggle-active/', views.JobToggleActiveView.as_view(), name='job-toggle-active'),

    # Applications & Saved
    path('jobs/apply/', views.ApplyJobView.as_view(), name='job-apply'),
    path('jobs/applied/', views.AppliedJobsListView.as_view(), name='applied-jobs'),
    path('jobs/save/', views.SaveJobView.as_view(), name='job-save'),
    path('jobs/saved/', views.SavedJobsListView.as_view(), name='saved-jobs'),

    path('jobs/applications/<int:pk>/withdraw/', views.WithdrawApplicationView.as_view(), name='withdraw-application'),

    # Employer sees applications
    path('jobs/applications/', views.EmployerApplicationsListView.as_view(), name='employer-applications'),
    path('jobs/applications/<int:pk>/status/', views.EmployerApplicationStatusUpdateView.as_view(), name='employer-application-status-update'),
]