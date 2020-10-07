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


@socketio.on('new_row_by_id')
def new_row_by_id(data):
    at_id = data['at_id']
    contents = data.get('contents')
    db.new_row_by_id(at_id, contents)

    data_out = {
        'entry_id': at_id,
        'new_entry': db[db.last_id],
    }

    emit('new_row', data_out, broadcast=True)

@socketio.on('new_row_by_index')
def new_row_by_index(data):
    index = data['index']
    contents = data.get('contents')
    db.new_row_by_index(index, contents)

    data_out = {
        'entry_id': db.last_id,
        'new_entry': db[db.last_id],
    }

    emit('new_row', data_out, broadcast=True)


@socketio.on('remove_row')
def remove_row(data):
    at_entry_id = data['entry_id']

    db.remove_row(at_entry_id)

    data_out = {
        'entry_id': at_entry_id,
    }

    emit('removed_row', data_out, broadcast=True)
