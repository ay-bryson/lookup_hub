import os
import random
import string

from flask import Flask, url_for


basedir = os.path.abspath(os.path.dirname(__file__))


class Config:

    # General Config
    SECRET_KEY = os.environ.get('SECRET_KEY')
    FLASK_APP = os.environ.get('FLASK_APP')
    FLASK_ENV = os.environ.get('FLASK_ENV')

    # Basicauth
    BASIC_AUTH_USERNAME = 'language'
    BASIC_AUTH_PASSWORD = 'awesumpassword123'

