from flask import current_app as app
from flask_socketio import emit
from .models import db, Entry
from . import socketio, db


@socketio.on('update_cell')
def update_cell(data):

    rowid = data['rowid']
    target = data['target']
    value = data['value']

    Entry.query.filter_by(id=rowid).update({target: value})
    db.session.commit()

    data_out = {
        'id': '-'.join([rowid, target]),
        'value': value,
    }

    emit('updated', data_out, broadcast=True)

