from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListTodo.as_view()),
    path('<int:pk>/', views.DetailTodo.as_view()),
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('add-vehicle/', views.AddVehicleView.as_view(), name='add_vehicle'),
    path('view-vehicles/', views.ViewVehicleView.as_view(), name='view_vehicles'),
    path('delete-vehicle/', views.DeleteVehicleView.as_view(), name='delete_vehicle'),
    path('detailedlot/', views.DetailedlotView.as_view(), name='detailedlot'),
    path('map/', views.MapView.as_view(), name='map'),
    
]