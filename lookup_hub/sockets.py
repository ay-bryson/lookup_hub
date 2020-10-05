from flask import current_app as app
from flask_socketio import emit
from . import socketio, db


@socketio.on('connect')
def pingpong():
    emit('pong')


@socketio.on('get_entry')
def get_entry(data):
    entry_id = data['entry_id']

    data_out = {
        'entry_id': entry_id,
        'entry': db[entry_id],
    }

    emit('got_entry', data_out)


@socketio.on('update_entry')
def update_entry(data):
    entry_id = data['entry_id']
    new_entry = data['new_entry']

    db[entry_id] = new_entry

    data_out = {
        'new_entry': db[entry_id],
    }

    emit('updated_entry', data_out, broadcast=True)


@socketio.on('new_row')
def new_row(data):
    at_entry_id = data['entry_id']

    db.new_row(at_entry_id)

    data_out = {
        'entry_id': at_entry_id,
        'new_entry': db[db.last_id],
    }

    emit('inserted_row', data_out, broadcast=True)


@socketio.on('remove_row')
def remove_row(data):
    at_entry_id = data['entry_id']

    db.remove_row(at_entry_id)

    data_out = {
        'entry_id': at_entry_id,
    }

    emit('removed_row', data_out, broadcast=True)