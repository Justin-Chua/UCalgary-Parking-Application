from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from parking.models import (
    ParkingLot, ParkingSpace, Vehicle, 
    Color, UniversityMember, Client, 
    ParkingAdmin, Patrols, Notification, 
    Payment, Ticket, ParkingPermit, Reservation
)

import datetime

class Command(BaseCommand):
    help = 'Populate the database with dummy data, which we can use to work with.'

    def handle(self, *args, **options):
        self.seed_users()
        self.seed_parking_lots()
        self.seed_parking_spaces()
        self.seed_vehicles()
        self.seed_colors()
        self.seed_university_members()
        self.seed_clients()
        self.seed_parking_admins()
        self.seed_patrols()
        self.seed_notifications()
        self.seed_payments()
        self.seed_tickets()
        self.seed_parking_permits()
        self.seed_reservations()

    def seed_users(self):
        users = []
        user_30098941 = User(username='30098941', email='justin.chua@ucalgary.ca')
        user_30098941.set_password('justinisthebest')
        users.append(user_30098941)
        user_12312312 = User(username='12312312', email='bob.dylan@ucalgary.ca')
        user_12312312.set_password('gobob123')
        users.append(user_12312312)
        user_65465465 = User(username='65465465', email='greg.oden@ucalgary.ca')
        user_65465465.set_password('nbagreg')
        users.append(user_65465465)
        user_99999999 = User(username='99999999', email='thedingleberry@ucalgary.ca')
        user_99999999.set_password('berrydingle')
        users.append(user_99999999)
        for user in users:
            try:
                user.save()
                self.stdout.write(self.style.SUCCESS(f'User with name {user.username} created successfully.'))
            except IntegrityError:
                self.stdout.write(self.style.WARNING(f'User with name {user.username} already exists.'))

    def seed_parking_lots(self):
        parking_lots = []
        # capacity = 120 for large parking lots, 80 for medium, 40 for small
        parking_lots.append(ParkingLot(
            lot_no=1,
            latitude=51.075974,
            longitude=-114.128476,
            capacity=40,
            occupied_spaces=0,
            rate_type=ParkingLot.HOURLY_PLUS_FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=10,
            latitude=51.080327,
            longitude=-114.138933,
            capacity=120,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=11,
            latitude=51.080261,
            longitude=-114.136291,
            capacity=80,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=12,
            latitude=51.080446,
            longitude=-114.134956,
            capacity=120,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=13,
            latitude=51.079638,
            longitude=-114.133491,
            capacity=80,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=14,
            latitude=51.081140,
            longitude=-114.132788,
            capacity=40,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=17,
            latitude=51.082615,
            longitude=-114.131020,
            capacity=40,
            occupied_spaces=0,
            rate_type=ParkingLot.HOURLY_PLUS_FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=25,
            latitude=51.079282,
            longitude=-114.124900,
            capacity=40,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))  
        parking_lots.append(ParkingLot(
            lot_no=28,
            latitude=51.078594,
            longitude=-114.125991,
            capacity=80,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))    
        parking_lots.append(ParkingLot(
            lot_no=32,
            latitude=51.076910,
            longitude=-114.122048,
            capacity=120,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=33,
            latitude=51.075690,
            longitude=-114.127011,
            capacity=40,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=34,
            latitude=51.075456,
            longitude=-114.125657,
            capacity=80,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=53,
            latitude=51.075341,
            longitude=-114.142745,
            capacity=120,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))
        parking_lots.append(ParkingLot(
            lot_no=64,
            latitude=51.078789,
            longitude=-114.140241,
            capacity=120,
            occupied_spaces=0,
            rate_type=ParkingLot.FLAT_RATE
        ))

        for parking_lot in parking_lots:
            # functionality based on INSERT IGNORE in MySQL
            if not ParkingLot.objects.filter(pk=parking_lot.pk).exists():
                parking_lot.save()
                self.stdout.write(self.style.SUCCESS(f'ParkingLot with PK {parking_lot.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'ParkingLot with PK {parking_lot.pk} already exists.'))

    def seed_parking_spaces(self):
        parking_lots = ParkingLot.objects.all()
        for parking_lot in parking_lots:
            if parking_lot.capacity == 40:
                ending_zone = 'D'
            elif parking_lot.capacity == 80:
                ending_zone = 'H'
            elif parking_lot.capacity == 120:
                ending_zone = 'L'
            for zone_char in range(ord('A'), ord(ending_zone) + 1):
                for stall in range (1, 11):
                    parking_space = ParkingSpace(
                        lot_no=parking_lot,
                        zone=chr(zone_char),
                        stall_no=stall
                    )
                    if not ParkingSpace.objects.filter(lot_no=parking_lot, zone=chr(zone_char), stall_no=stall).exists():
                        parking_space.save()
                        stalls_found = False
                    else:
                        stalls_found = True
            if not stalls_found:
                self.stdout.write(self.style.SUCCESS(f'Parking Stalls for Lot {parking_lot.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Parking Stalls for Lot {parking_lot.pk} already exist.'))

    def seed_vehicles(self):
        vehicles = []
        owner_30098941 = User.objects.get(username='30098941')
        vehicles.append(Vehicle(
            plate_no='CGG4891',
            make='Nissan',
            model='Skyline',
            lot_no=None,
            owner=owner_30098941
        ))
        owner_12312312 = User.objects.get(username='12312312')
        vehicles.append(Vehicle(
            plate_no='SINGER',
            make='Toyota',
            model='Corolla',
            lot_no=None,
            owner=owner_12312312
        ))
        owner_65465465 = User.objects.get(username='65465465')
        vehicles.append(Vehicle(
            plate_no='DANCER',
            make='Subaru',
            model='Impreza',
            lot_no=None,
            owner=owner_65465465
        ))

        for vehicle in vehicles:
            if not Vehicle.objects.filter(pk=vehicle.pk).exists():
                vehicle.save()
                self.stdout.write(self.style.SUCCESS(f'Vehicle with PK {vehicle.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Vehicle with PK {vehicle.pk} already exists.'))

    def seed_colors(self):
        colors = []
        plate_CGG4891 = Vehicle.objects.get(plate_no='CGG4891')
        colors.append(Color(
            plate_no=plate_CGG4891,
            vehicle_color='Blue'
        ))
        plate_SINGER = Vehicle.objects.get(plate_no='SINGER')
        colors.append(Color(
            plate_no=plate_SINGER,
            vehicle_color='Red'
        ))
        plate_DANCER = Vehicle.objects.get(plate_no='Dancer')
        colors.append(Color(
            plate_no=plate_DANCER,
            vehicle_color='White'
        ))

        for color in colors:
            if not Color.objects.filter(pk=color.pk).exists():
                color.save()
                self.stdout.write(self.style.SUCCESS(f'Color with PK {color.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Color with PK {color.pk} already exists.'))


    def seed_university_members(self): 
        university_members = []
        user_30098941 = User.objects.get(username='30098941')
        university_members.append(UniversityMember(
            user=user_30098941,
            ucid='30098941',
            name='Justin Chua',
            email='justin.chua@ucalgary.ca',
            password=make_password('justinisthebest'),
            address='123 Skyward Ave',
            phone_no='4037998999'
        ))
        user_12312312 = User.objects.get(username='12312312')
        university_members.append(UniversityMember(
            user=user_12312312,
            ucid='12312312',
            name='Bob Dylan',
            email='bob.dylan@ucalgary.ca',
            password=make_password('gobob123'),
            address='43 Irvine Blvd',
            phone_no='5876819942'
        ))
        user_65465465 = User.objects.get(username='65465465')
        university_members.append(UniversityMember(
            user=user_65465465,
            ucid='65465465',
            name='Greg Oden',
            email='greg.oden@ucalgary.ca',
            password=make_password('nbagreg'),
            address='449 Hollywood Blvd',
            phone_no='8196430001'
        ))
        user_99999999 = User.objects.get(username='99999999')
        university_members.append(UniversityMember(
            user=user_99999999,
            ucid='99999999',
            name='Perry Dingleberry',
            email='thedingleberry@ucalgary.ca',
            password=make_password('berrydingle'),
            address='448 Douglesdale Road',
            phone_no='4418936891'
        ))

        for member in university_members:
            if not UniversityMember.objects.filter(pk=member.pk).exists():
                member.save()
                self.stdout.write(self.style.SUCCESS(f'UniversityMember with PK {member.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'UniversityMember with PK {member.pk} already exists.'))
    
    def seed_clients(self):
        clients = []
        member_30098941 = UniversityMember.objects.get(ucid=30098941)
        plate_CGG4891 = Vehicle.objects.get(plate_no='CGG4891')
        clients.append(Client(
            client_ucid=member_30098941,
            plate_no=plate_CGG4891
        ))
        member_12312312 = UniversityMember.objects.get(ucid=12312312)
        plate_SINGER = Vehicle.objects.get(plate_no='SINGER')
        clients.append(Client(
            client_ucid=member_12312312,
            plate_no=plate_SINGER
        ))
        member_65465465 = UniversityMember.objects.get(ucid=65465465)
        plate_DANCER = Vehicle.objects.get(plate_no='DANCER')
        clients.append(Client(
            client_ucid=member_65465465,
            plate_no=plate_DANCER
        ))

        for client in clients:
            if not Client.objects.filter(pk=client.pk).exists():
                client.save()
                self.stdout.write(self.style.SUCCESS(f'Client with PK {client.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Client with PK {client.pk} already exists.'))
    
    def seed_parking_admins(self):
        member_99999999 = UniversityMember.objects.get(ucid=99999999)
        parking_admin = ParkingAdmin(admin_ucid=member_99999999)
        if not ParkingAdmin.objects.filter(pk=parking_admin.pk).exists():
            parking_admin.save()
            self.stdout.write(self.style.SUCCESS(f'ParkingAdmin with PK {parking_admin.pk} created successfully.'))
        else:
            self.stdout.write(self.style.WARNING(f'ParkingAdmin with PK {parking_admin.pk} already exists.'))

    def seed_patrols(self):
        member_99999999 = ParkingAdmin.objects.get(admin_ucid=99999999)
        lot_10 = ParkingLot.objects.get(lot_no=10)
        patrols = Patrols(
            admin_ucid=member_99999999,
            lot_no=lot_10
        )
        if not Patrols.objects.filter(admin_ucid=member_99999999, lot_no=lot_10).exists():
            patrols.save()
            self.stdout.write(self.style.SUCCESS(f'Patrols with PK [{patrols.admin_ucid},{patrols.lot_no}] created successfully.'))
        else:
            self.stdout.write(self.style.WARNING(f'Patrols with PK [{patrols.admin_ucid},{patrols.lot_no}] already exists.'))
    
    def seed_notifications(self):
        notifications = []
        client_30098941 = Client.objects.get(client_ucid=30098941)
        notifications.append(Notification(
            client_ucid=client_30098941,
            title='Parking Ticket Received',
            message='You have received a new parking ticket.'
        ))
        notifications.append(Notification(
            client_ucid=client_30098941,
            title='Parking Ticket Overdue',
            message='The due date has passed for a parking ticket registered \
                    to your account. The amount due has increased by $20.00 '
        ))
        client_12312312 = Client.objects.get(client_ucid=12312312)
        notifications.append(Notification(
            client_ucid=client_12312312,
            title='Parking Ticket Received',
            message='You have received a new parking ticket.'
        ))
        notifications.append(Notification(
            client_ucid=client_12312312,
            title='Parking Permit Revoked',
            message='Due to a large number of outstanding tickets on your account, \
                your parking permit has been revoked.'
        ))

        primary_key = 1
        for notification in notifications:
            if not Notification.objects.filter(pk=primary_key).exists():
                notification.save()
                self.stdout.write(self.style.SUCCESS(f'Notification with PK {notification.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Notification for {notification.client_ucid} already exists.'))
            primary_key += 1
    
    def seed_payments(self):
        payments = []
        client_30098941 = Client.objects.get(client_ucid=30098941)
        payments.append(Payment(
            client_ucid=client_30098941,
            cc_holder='Justin Chua',
            cc_number='4444555577778888',
            cvc='101',
            cc_expiry_month=12,
            cc_expiry_year=27
        ))
        payments.append(Payment(
            client_ucid=client_30098941,
            cc_holder='Justin Chua',
            cc_number='4444555577778888',
            cvc='101',
            cc_expiry_month=12,
            cc_expiry_year=27
        ))
        client_12312312 = Client.objects.get(client_ucid=12312312)
        payments.append(Payment(
            client_ucid=client_12312312,
            cc_holder='Bob Dylan',
            cc_number='1111222233334444',
            cvc='981',
            cc_expiry_month=5,
            cc_expiry_year=26
        ))
        payments.append(Payment(
            client_ucid=client_30098941,
            cc_holder='Justin Chua',
            cc_number='4444555577778888',
            cvc='101',
            cc_expiry_month=12,
            cc_expiry_year=27           
        ))
        payments.append(Payment(
            client_ucid=client_12312312,
            cc_holder='Bob Dylan',
            cc_number='1111222233334444',
            cvc='981',
            cc_expiry_month=5,
            cc_expiry_year=26            
        ))

        primary_key = 1
        for payment in payments:
            if not Payment.objects.filter(pk=primary_key).exists():
                payment.save()
                self.stdout.write(self.style.SUCCESS(f'Payment with PK {payment.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Payment for {payment.client_ucid} already exists.'))
            primary_key += 1

    def seed_tickets(self):
        tickets = []
        client_30098941 = Client.objects.get(client_ucid=30098941)
        notification_1 = Notification.objects.get(pk=1)
        payment_1 = Payment.objects.get(pk=1)
        admin_99999999 = ParkingAdmin.objects.get(admin_ucid=99999999)
        tickets.append(Ticket(
            notification_id=notification_1,
            payment_no=payment_1,
            client_ucid=client_30098941,
            admin_ucid=admin_99999999,
            issue_date=datetime.date.today(),
            due_date=datetime.date.today() + datetime.timedelta(days=14),
            offense='Unauthorized Parking',
            amount_due=50,
            paid=True
        ))
        notification_2 = Notification.objects.get(pk=2)
        tickets.append(Ticket(
            notification_id=notification_2,
            payment_no=None,
            client_ucid=client_30098941,
            admin_ucid=admin_99999999,
            issue_date=datetime.date.today() - datetime.timedelta(days=14),
            due_date=datetime.date.today(),
            offense='Obstructed Parking',
            amount_due=40,
            paid=False
        ))
        notification_3 = Notification.objects.get(pk=3)
        client_12312312 = Client.objects.get(client_ucid=12312312)
        tickets.append(Ticket(
            notification_id=notification_3,
            payment_no=None,
            client_ucid=client_12312312,
            admin_ucid=admin_99999999,
            issue_date=datetime.date.today(),
            due_date=datetime.date.today() + datetime.timedelta(days=14),
            offense='Unauthorized Parking',
            amount_due=50,
            paid=False
        ))

        primary_key = 1
        for ticket in tickets:
            if not Ticket.objects.filter(pk=primary_key).exists():
                ticket.save()
                self.stdout.write(self.style.SUCCESS(f'Ticket with PK {ticket.pk} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Ticket for {ticket.client_ucid} already exists.'))
            primary_key += 1
        
    def seed_parking_permits(self):
        permits = []
        client_30098941 = Client.objects.get(client_ucid=30098941)
        admin_99999999 = ParkingAdmin.objects.get(admin_ucid=99999999)
        payment_2 = Payment.objects.get(pk=2)
        permits.append(ParkingPermit(
            client_ucid=client_30098941,
            admin_ucid=admin_99999999,
            payment_no=payment_2,
            pp_issue_date=datetime.date(year=2024, month=1, day=2),
            pp_expiry_date=datetime.date(year=2024, month=4, day=23),
            pp_amount_due=500
        ))
        client_12312312 = Client.objects.get(client_ucid=12312312)
        payment_3 = Payment.objects.get(pk=3)
        permits.append(ParkingPermit(
            client_ucid=client_12312312,
            admin_ucid=admin_99999999,
            payment_no=payment_3,
            pp_issue_date=datetime.date(year=2024, month=1, day=2),
            pp_expiry_date=datetime.date(year=2024, month=4, day=23),
            pp_amount_due=500       
        ))

        primary_key = 1
        for permit in permits:
            if not ParkingPermit.objects.filter(pk=primary_key).exists():
                permit.save()
                self.stdout.write(self.style.SUCCESS(f'ParkingPermit for {permit.client_ucid} created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'ParkingPermit for {permit.client_ucid} already exists.'))
            primary_key += 1
    
    def seed_reservations(self):
        reservations = []
        lot_13 = ParkingLot.objects.get(lot_no=13)
        client_30098941 = Client.objects.get(client_ucid=30098941)
        payment_4 = Payment.objects.get(pk=4)
        reservations.append(Reservation(
            lot_no=lot_13,
            client_ucid=client_30098941,
            payment_no=payment_4,
            date=datetime.date.today(),
            start_time=datetime.time(hour=15, minute=30),
            end_time=datetime.time(hour=23, minute=59),
            res_amount_due=9
        ))
        lot_64 = ParkingLot.objects.get(lot_no=64)
        client_12312312 = Client.objects.get(client_ucid=12312312)
        payment_5 = Payment.objects.get(pk=5)
        reservations.append(Reservation(
            lot_no=lot_64,
            client_ucid=client_12312312,
            payment_no=payment_5,
            date=datetime.date.today(),
            start_time=datetime.time(hour=8, minute=0),
            end_time=datetime.time(hour=23, minute=59),
            res_amount_due=9
        ))

        for reservation in reservations:
            if not Reservation.objects.filter(
                lot_no=reservation.lot_no, 
                client_ucid=reservation.client_ucid).exists():
                reservation.save()
                self.stdout.write(self.style.SUCCESS(f'Reservation for PK [{reservation.lot_no},{reservation.client_ucid}] created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Reservation for PK [{reservation.lot_no},{reservation.client_ucid}] already exists.'))

                      







        

