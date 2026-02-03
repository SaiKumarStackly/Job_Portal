from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Notification
 
@receiver(post_save, sender=Notification)
def send_email_when_notification_created(sender, instance, created, **kwargs):
    if created:
        user = instance.user
 
        if user.email:
            send_mail(
                subject="New Notification",
                message=instance.text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
 
 