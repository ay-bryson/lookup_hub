import os
import random
import string
import sqlite3

from flask import Flask, url_for
from flask_basicauth import BasicAuth

from tools import get_dictionary


def get_json_fp():
    if os.path.isfile('data/dictionary.json'):
        json_fp = 'data/dictionary.json'
    else:
        json_fp = 'data/dummy_dictionary.json'

    return json_fp

APP = Flask(__name__)

# APP.config['TEMPLATES_AUTO_RELOAD'] = True
APP.config['BASIC_AUTH_USERNAME'] = 'language'
APP.config['BASIC_AUTH_PASSWORD'] = 'awesumpassword123'
APP.config['STATIC_URL_PATH'] = '/static'
APP.config['SECRET_KEY'] = ''.join(
    random.choice(string.ascii_letters) for i in range(24))

JSON_FP = get_json_fp()

AUTH = BasicAuth(APP)

