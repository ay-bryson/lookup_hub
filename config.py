from flask import Flask, url_for


app = Flask(__name__)

DICT_FP = url_for('static', filename='dictionary.json')

print(DICT_FP)