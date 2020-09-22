import os
import random
import string
import sqlite3

from flask import Flask, url_for
from flask_basicauth import BasicAuth
from dotenv import load_dotenv


basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))



class Config:
    """Set Flask configuration from .env file."""

    # General Config
    SECRET_KEY = os.environ.get('SECRET_KEY')
    FLASK_APP = os.environ.get('FLASK_APP')
    FLASK_ENV = os.environ.get('FLASK_ENV')

    # Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.abspath('data/dictionary.db')
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Basicauth
    BASIC_AUTH_USERNAME = 'language'
    BASIC_AUTH_PASSWORD = 'awesumpassword123'
