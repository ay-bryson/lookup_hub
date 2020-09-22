from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO


db = SQLAlchemy()
socketio = SocketIO()


def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.Config')

    db.init_app(app)
    socketio.init_app(app)

    with app.app_context():
        from . import routes
        from . import sockets
        db.create_all()
        db.session.commit()

        return app