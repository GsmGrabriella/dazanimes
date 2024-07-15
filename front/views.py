from django.shortcuts import render

def login(request):
    return render(request, 'front/auth/login.html')
