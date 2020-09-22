
# import json
# import sqlite3

# from flask import render_template, request
# from flask_socketio import SocketIO, emit
# from flask_sqlalchemy import SQLAlchemy

# from config import APP as app
# from config import AUTH as auth
# # from config import JSON_FP, DB_FP


# socketio = SocketIO(app)



# @app.route('/')
# def index():
#     return render_template('index.html')


# @app.route('/hub')
# def lookup_hub():
#     return render_template('hub.html', 
#                            dictionary=DICTI,
#                            keys=KEYS)


# @socketio.on('update_cell')
# def update_cell(data):

#     rowid = data['rowid']
#     target_language = data['target_language']
#     value = data['value']

#     conn = sqlite3.connect(DB_FP)
#     cursor = conn.cursor()
#     command = f'UPDATE dictionary SET {target_language} = "{value}" WHERE rowid = {int(rowid)}'
#     # command = '''UPDATE dictionary SET ? = ? WHERE rowid = ?'''
#     cursor.execute(command)
    
#     cursor.close()
#     conn.close()

#     data_out = {
#         'id': '-'.join([rowid, target_language]),
#         'value': value,
#     }

#     emit('updated', data_out, broadcast=True)


# # def get_dictionary():
# #     with open(JSON_FP, 'r') as json_f:
# #         dictionary = json.load(json_f)
# #     return dictionary


# # def save_dictionary():
# #     with open(JSON_FP, 'w') as json_f:
# #         json.dump(DICTI, json_f, indent=4)

    
# def get_dictionary_from_db():
#     conn = sqlite3.connect(DB_FP)
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM dictionary;")
#     data = cursor.fetchall()
#     cursor.close()
    
#     keys = [entry[0] for entry in data]
#     dictionary = [entry[1:4] for entry in data]
    
#     return keys, dictionary


# KEYS, DICTI = get_dictionary_from_db()

