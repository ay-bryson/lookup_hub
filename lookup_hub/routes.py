from flask import render_template, request
from flask import current_app as app

from .models import Entry
from . import db


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hub')
def lookup_hub():
    # entry = Entry(en='hello', de='hallo', nl='hej', en_c='yes', de_c='ja', nl_c='jep')
    # db.session.add(entry)
    # db.session.commit()
    
    data = Entry.query.all()
    
    return render_template('hub.html',
                           dictionary=data)