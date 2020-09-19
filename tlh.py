
import json
import sqlite3

from flask import render_template, request
from flask_socketio import SocketIO, emit

from config import APP as app
from config import AUTH as auth
from config import JSON_FP
# from tools import get_dictionary


socketio = SocketIO(app)



@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hub')
def lookup_hub():
    return render_template('hub.html', dictionary=DICTI)


@socketio.on('update_cell')
def update_cell(data):
    key = data['key']
    target_language = data['target_language']
    value = data['value']

    DICTI[key][target_language]['text'] = value

    data_out = {
        'id': '-'.join([key, target_language]),
        'value': value,
    }

    emit('updated', data_out, broadcast=True)


def get_dictionary():
    with open(JSON_FP, 'r') as json_f:
        dictionary = json.load(json_f)
    return dictionary


DICTI = get_dictionary()


if __name__ == '__main__':
    socketio.run(
        app,
        debug=True,
    )
    # app.run(
    #     debug=True
    # )
