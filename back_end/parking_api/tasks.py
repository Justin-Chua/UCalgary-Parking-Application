from celery import shared_task
from django.utils.timezone import now
from django.db.models import Q
from parking.models import Notification, Ticket, ParkingPermit, Reservation

@shared_task
def notify_overdue_tickets():
    # filter based on if due date is before today's date
    overdue_ticket_set = Ticket.objects.filter(due_date__lt=now().date())
    # create a new notification for all overdue tickets
    for overdue_ticket in overdue_ticket_set:
        notification = Notification(
            client_ucid=overdue_ticket.client_ucid,
            title='Parking Ticket Overdue',
            message='The due date has passed for a parking ticket registered \
                to your account. The amount due has increased by $20.00 '
        )
        notification.save()

@shared_task
def delete_expired_permits():
    expired_permit_set = ParkingPermit.objects.filter(pp_expiry_date__lt=now().date())
    # delete all expired permits
    for expired_permit in expired_permit_set:
        expired_permit.delete()

@shared_task
def delete_expired_reservations():
    expired_reservation_set = Reservation.objects.filter(
        Q(date__lt=now().date()) | Q(date=now().date(), end_time__lt=now().time()))
    # delete all expired reservations
    for expired_reservation in expired_reservation_set:
        expired_reservation.delete()

# @shared_task
# def delete_paid_tickets():
#     paid_ticket_set = Ticket.objects.filter(paid=1)
#     # delete all paid tickets
#     for paid_ticket in paid_ticket_set:
#         paid_ticket.delete()


    