from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from .forms import RegistrationForm

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = RegistrationForm()
    return render(request, 'registration/register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'registration/login.html', {'error_message': 'Invalid login'})
    return render(request, 'registration/login.html')

def payment(request):
    # if request.method == 'POST':
    #     name = request.POST.get('Name')
    #     number = request.POST.get('Number')
    #     date = request.POST.get('Date')
    #     cvv = request.POST.get('cvv')
    #     
    return render(request, "paymentform/payment.html")