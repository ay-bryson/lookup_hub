import os, sys

sys.path.append("/home/samaybry/public_html/tlh");
sys.path.insert(0, os.path.dirname(__file__))

from config import APP

APP.secret_key = 'aotearoa2013'