from celery import shared_task
import datetime
from django.db.models import Q
from parking.models import Notification, Ticket, ParkingPermit, Reservation

@shared_task
def delete_expired_permits():
    expired_permit_set = ParkingPermit.objects.filter(pp_expiry_date__lt=datetime.date.today())
    # delete all expired permits
    for expired_permit in expired_permit_set:
        expired_permit.delete()

@shared_task
def delete_expired_reservations():
    expired_reservation_set = Reservation.objects.filter(date__lte=datetime.date.today(), end_time__lt=datetime.datetime.now().time())
    for expired_reservation in expired_reservation_set:
        # update occupied status of stall in parking lot
        expired_reservation.stall.occupied = False
        expired_reservation.stall.save()

        # delete expired reservation
        expired_reservation.delete()

@shared_task
def notify_overdue_tickets():
    # filter based on if due date is before today's date
    overdue_ticket_set = Ticket.objects.filter(due_date__lt=datetime.date.today())
    # create a new notification for all overdue tickets
    for overdue_ticket in overdue_ticket_set:
        if (overdue_ticket.due_date == datetime.date.today() - datetime.timedelta(days=1)):
            overdue_ticket.amount_due += 20
            overdue_ticket.save()

        notification = Notification(
            client_ucid=overdue_ticket.client_ucid,
            title='Parking Ticket Overdue',
            message='The due date has passed for a parking ticket registered \
                to your account. The amount due has increased by $20.00 '
        )
        notification.save()

    