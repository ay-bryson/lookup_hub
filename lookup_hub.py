from config import APP as app
from tools import get_dictionary

from flask import render_template, request
from flask_socketio import SocketIO, emit
from flask_basicauth import BasicAuth


socketio = SocketIO(app)
basic_auth = BasicAuth(app)


@app.route('/')
def index():
    context = {
        'dictionary': get_dictionary()
    }
    return render_template('main.html', **context)


if __name__ == '__main__':
    socketio.run(
        app,
        debug=True,
        # host='0.0.0.0',
    )
