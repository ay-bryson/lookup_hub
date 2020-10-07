from flask import render_template, request, Response
from flask import current_app as app
from flask_basicauth import BasicAuth

from . import db, dummy_db


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

@app.route('/sandbox')
def try_it_out():
    return render_template('hub.html',
                           dictionary=dummy_db[:],
                           indices=dummy_db.ids,)


@app.route('/mistakes')
def mistakes():
    return 'Coming soon?'


@app.route('/download_dict')
@basic_auth.required
def download_dict():
    data = db.read_jsonl()
    return Response(
        data,
        mimetype="application/json",
        headers={"Content-disposition":
                 "attachment; filename=dictionary.jsonl"})
