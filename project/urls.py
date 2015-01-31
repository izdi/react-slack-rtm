from django.conf.urls import patterns, include, url
from django.contrib import admin

from users.views import RegistrationView, LoginView

urlpatterns = patterns('',
    url(r'^register$', RegistrationView.as_view(), name='register'),
    url(r'^login$', LoginView.as_view(), name='login'),
    url(r'^', include('djslack.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
