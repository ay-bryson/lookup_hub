from flask import render_template, request
from flask import current_app as app
from flask_basicauth import BasicAuth

from . import db


basic_auth = BasicAuth(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hub')
@basic_auth.required
def lookup_hub():

    return render_template('hub.html',
                           dictionary=db[:],
                           indices=db.ids,)


@app.route('/mistakes')
def mistakes():
    return 'Coming soon?'