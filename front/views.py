from django.shortcuts import render

def login(request):
    if request.method == 'GET':
        return render(request, 'front/auth/login.html')
    elif request.method == 'POST':
        return
    else:
        return render(request, 'front/notfound.html')

def register(request):
    if request.method == 'GET':
        return render(request, 'front/auth/register.html')
    elif request.method == 'POST':
        username = str(request.POST.get('username'))
        email = str(request.POST.get('email'))
        password = str(request.POST.get('password'))
        password_confirm = str(request.POST.get('password_confirm'))

        data = [
            username,
            email,
            password,
            password_confirm
        ]

        return render(request, 'front/auth/data.html', {"data":data})
    else:
        return render(request, 'front/notfound.html')
    
