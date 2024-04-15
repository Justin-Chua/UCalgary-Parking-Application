from django.urls import path

from . import views

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('add-vehicle/', views.AddVehicleView.as_view(), name='add_vehicle'),
    path('view-vehicles/', views.ViewVehicleView.as_view(), name='view_vehicles'),
    path('delete-vehicle/', views.DeleteVehicleView.as_view(), name='delete_vehicle'),
    path('vehicles-data/', views.VehiclesDataView.as_view(), name='vehicles_data'),
    path('usersearch/', views.UserSearchView.as_view(), name='user_search'),
    path('check-admin-status/', views.CheckAdminStatus.as_view()),
    path('tickets/create/', views.TicketCreateView.as_view(), name='ticket-create'),
    path('map/', views.MapView.as_view(), name='map'),
    path('map-popup/', views.MapPopupView.as_view(), name='map-popup'),
    path('view-tickets/', views.TicketView.as_view(), name='view-tickets'),
    path('view-permits/', views.ParkingPermitView.as_view(), name='view-permits'),
    path('view-reservations/', views.ReservationView.as_view(), name='view-reservations'),
    path('client_conditions/', views.ClientConditionsChecker.as_view(), name='client_conditions'),
    path('revoke-permit/', views.RevokePermitView.as_view(), name='revoke_permit'),
    path('view-notifications/', views.NotificationView.as_view(), name='view-reservations')
]