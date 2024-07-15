from django.urls import path
from front.views import login

urlpatterns = [
  path('login', login, name='login'),

]