# from config import APP as app
# from tools import get_dictionary

# from flask import render_template, request
# # from flask_socketio import SocketIO, emit
# # from flask_basicauth import BasicAuth


# # socketio = SocketIO(app)
# # basic_auth = BasicAuth(app)


# @app.route('/')
# def index():
#     context = {
#         'dictionary': get_dictionary()
#     }
#     return render_template('main.html', **context)


# if __name__ == '__main__':
#     # socketio.run(
#     #     app,
#     #     # debug=True,
#     # )
#     app.run()

import sys

from flask import Flask, __version__
app = Flask(__name__)
application = app


@app.route("/")
def hello():
    return """

        HelioHost rules!<br><br>
        <a href="/flask/python/version/">Python version</a><br>
        <a href="/flask/flask/version/">Flask version</a>

    """


@app.route("/python/version/")
def p_version():
    return "Python version %s" % sys.version


@app.route("/flask/version/")
def f_version():
    return "Flask version %s" % __version__


if __name__ == "__main__":
    app.run()
