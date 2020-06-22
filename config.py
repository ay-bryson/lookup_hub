import random
import string

from flask import Flask, url_for


APP = Flask(__name__)

# DICT_FP = url_for('static', filename='dictionary.json')

APP.config['BASIC_AUTH_USERNAME'] = 'language'
APP.config['BASIC_AUTH_PASSWORD'] = 'awesumpassword123'
APP.config['SECRET_KEY'] = ''.join(
    random.choice(string.ascii_letters) for i in range(24))
