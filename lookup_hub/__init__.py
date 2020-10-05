from flask import Flask
from flask_socketio import SocketIO

from .models import Database


db = Database()
socketio = SocketIO()


def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.Config')

    socketio.init_app(app)

    with app.app_context():
        from . import routes
        from . import sockets

        return app
