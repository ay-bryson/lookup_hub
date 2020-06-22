import os, sys

sys.path.append("/home/samaybry/public_html/tlh");

sys.path.insert(0, os.path.dirname(__file__))
from config import APP as app

application.secret_key = 'aotearoa2013'