from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'parking_api.settings')

app = Celery('parking_api')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(['parking_api'])

app.conf.beat_schedule = {
    'delete-tickets' : {
        'task' : 'parking_api.tasks.delete_paid_tickets',
        'schedule' : 60.0
    },
    'delete-expired-reservations' : {
        'task' : 'parking_api.tasks.delete_expired_reservations',
        'schedule' : 60.0
    },
    'delete-expired-permits' : {
        'task' : 'parking_api.tasks.delete_expired_permits',
        'schedule' : 60.0
    },
    'notify-overdue-tickets' : {
        'task' : 'parking_api.tasks.notify_overdue_tickets',
        'schedule' : 60.0
    }
}