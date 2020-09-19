import os, sys

sys.path.append("/home/aybry/public_html/lookup_hub");
sys.path.insert(0, os.path.dirname(__file__))

from config import APP as application

application.secret_key = 'aotearoa2013'