from django.urls import path
from front.views import login, register

urlpatterns = [
  path('login', login, name='login'),
  path('register', register, name='register'),

]