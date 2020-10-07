from flask import current_app as app
from flask_socketio import emit
from . import socketio, db, dummy_db


@socketio.on('connect')
def pingpong():
    emit('pong')


@socketio.on('get_entry')
def get_entry(data):
    current_db = dummy_db if data.get('dummy') else db

    entry_id = data['entry_id']

    data_out = {
        'entry_id': entry_id,
        'entry': current_db[entry_id],
    }

    emit('got_entry', data_out)


@socketio.on('update_entry')
def update_entry(data):
    current_db = dummy_db if data.get('dummy') else db

    entry_id = data['entry_id']
    new_entry = data['new_entry']

    current_db[entry_id] = new_entry

    data_out = {
        'new_entry': current_db[entry_id],
    }

    emit('updated_entry', data_out, broadcast=True)


@socketio.on('new_row_by_id')
def new_row_by_id(data):
    current_db = dummy_db if data.get('dummy') else db

    at_id = data['at_id']
    contents = data.get('contents')
    current_db.new_row_by_id(at_id, contents)

    data_out = {
        'entry_id': at_id,
        'new_entry': current_db[current_db.last_id],
    }

    emit('new_row', data_out, broadcast=True)

@socketio.on('new_row_by_index')
def new_row_by_index(data):
    current_db = dummy_db if data.get('dummy') else db

    index = data['at_index']
    contents = data.get('contents')
    current_db.new_row_by_index(index, contents)

    data_out = {
        'new_entry': current_db[current_db.last_id],
    }

    emit('new_row_append', data_out, broadcast=True)


@socketio.on('remove_row')
def remove_row(data):
    current_db = dummy_db if data.get('dummy') else db

    at_entry_id = data['entry_id']

    current_db.remove_row(at_entry_id)

    data_out = {
        'entry_id': at_entry_id,
    }

    emit('removed_row', data_out, broadcast=True)
