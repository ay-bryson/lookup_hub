from flask import render_template, request
from flask import current_app as app

from . import db


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hub')
def lookup_hub():

    return render_template('hub.html',
                           dictionary=db[:500],
                           indices=db.indices,)