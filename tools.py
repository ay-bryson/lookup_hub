import json


def get_dictionary():
    with open('static/dictionary.json') as f:
        dictionary = json.load(f)

    return dictionary