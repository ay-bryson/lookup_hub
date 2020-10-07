import os
import json
import uuid

from redis import Redis
from rq import Queue, Worker, Connection

from config import basedir


redis_conn = Redis()
q = Queue(connection=redis_conn)
w = Worker(q)


class Database(object):

    def __init__(self, dummy=False):
        self.data = []
        self.ids = []
        self.i_am_a_dummy = dummy

        if self.i_am_a_dummy:
            self.jsonl_fp = init_dummy_dictionary()
        else:
            self.jsonl_fp = os.path.join(basedir, 'data', 'dictionary.jsonl')

        with open(self.jsonl_fp, 'r') as jsonl_fp:
            for jsonline in jsonl_fp:
                line = Line(jsonline)
                self.data.append(line)
                self.ids.append(line.id)

        self.last = None

    def __getitem__(self, key):
        # If using uuid
        if isinstance(key, str):
            index = self.ids.index(key)
            return self.data[index].data

        # If slicing/indexing
        try:
            return self.data[key].data
        except:
            return [line.data for line in self.data[key]]

    def __setitem__(self, key, contents):
        index = self.ids.index(key)
        self.data[index].data.update(contents)

        self._save()

    def _save(self):
        q.enqueue(self.update_jsonl, self.data)

    def new_row_by_index(self, index, contents=None):
        new_row = Line(contents)
        if index == -1:
            self.data.append(new_row)
            self.ids.append(new_row.id)
        else:
            self.data.insert(index, new_row)
            self.ids.insert(index, new_row.id)

        self.last_id = new_row.id

        self._save()

    def new_row_by_id(self, id_in, contents=None):
        if id_in is not None:
            index = self.ids.index(id_in)
        else:
            index = -1

        self.new_row_by_index(index, contents)

    def remove_row(self, key):
        index = self.ids.index(key)
        self.data.pop(index)
        self.ids.pop(index)

        self._save()

    def update_jsonl(self, data):
        with open(self.jsonl_fp, 'w') as jsonl_f:
            for entry in data:
                jsonl_f.writelines(json.dumps(entry.data) + '\n')

    def read_jsonl(self):
        with open(self.jsonl_fp, 'r') as jsonl_f:
            json_lines = jsonl_f.read()
        return json_lines


class Line(object):

    def __init__(self, contents=None):

        if contents is None:
            self.data = self.get_empty_dict()
        elif isinstance(contents, dict):
            self.data = contents
        else:
            self.data = json.loads(contents)

        if self.data.get('id') is not None:
            self.id = self.data.get('id')
        else:
            self.id = str(uuid.uuid4())
            self.data.update({'id': self.id})


    def get_empty_dict(self):
        return {
            'en': {'text': None, 'comment': None},
            'de': {'text': None, 'comment': None},
            'nl': {'text': None, 'comment': None},
        }


def init_dummy_dictionary():
    data_dir = os.path.join(basedir, 'data')
    jsonl_fp = os.path.join(data_dir, 'dummy_dictionary.jsonl')

    dummy_dict = [
        {
            "de": {"text": "Hallo", "colour": "#ffffff", "comment": None},
            "en": {"text": "Hello", "colour": "#9D2C2C", "comment": "Or 'Good day'"},
            "nl": {"text": "Hallo", "colour": "#ffffff", "comment": None}
        },
        {
            "de": {"text": "Tschüß", "colour": "#ffffff", "comment": None},
            "en": {"text": "Bye", "colour": "#164200", "comment": "Or 'Goodbye'"},
            "nl": {"text": "Doei", "colour": "#62B639", "comment": None}
        },
    ]

    if not os.path.isdir(data_dir):
        os.mkdir(data_dir)

    with open(jsonl_fp, 'w+') as jsonl_f:
        for entry in dummy_dict:
            jsonl_f.write(json.dumps(entry) + '\n')

    return jsonl_fp
