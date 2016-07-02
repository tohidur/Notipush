from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout,
)
from django.shortcuts import render, redirect
from .forms import UserLoginForm, UserRegistrationForm
from pushes.models import Websites

User = get_user_model()


def login_register_view(request):
    next_request = request.GET.get('next')
    form_login = UserLoginForm(request.POST or None)
    if form_login.is_valid():
        username = form_login.cleaned_data.get('username')
        password = form_login.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        login(request, user)
        if next_request:
            return redirect(next_request)
        return redirect('/')
    else:
        form_register = UserRegistrationForm(request.POST or None)
        if form_register.is_valid():
            user = form_register.save(commit=False)
            username = form_register.cleaned_data.get('username')
            password = form_register.cleaned_data.get('password')
            user.set_password(password)
            user.save()

            new_user = authenticate(username=username, password=password)
            login(request, new_user)
            if next_request:
                return redirect(next_request)
            return redirect('/')
    return render(request, 'form.html', {'form_login': form_login,'form_register':form_register})


# def register_view(request):
#     next_request = request.GET.get('next')
#     title = 'Register'
#     form = UserRegistrationForm(request.POST or None)
#     if form.is_valid():
#         user = form.save(commit=False)
#         username = form.cleaned_data.get('username')
#         password = form.cleaned_data.get('password')
#         user.set_password(password)
#         user.save()
#
#         new_user = authenticate(username=username, password=password)
#         login(request, new_user)
#         if next_request:
#             return redirect(next_request)
#         return redirect('/')
#
#     context = {
#         'form': form,
#         'title': title,
#     }
#     return render(request, 'form.html', context)


def logout_view(request):
    logout(request)
    return redirect('/')
