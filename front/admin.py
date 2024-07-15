from django.contrib import admin

from .models import User, Follow, Post, Like

admin.site.register(User)
admin.site.register(Follow)
admin.site.register(Post)
admin.site.register(Like)
