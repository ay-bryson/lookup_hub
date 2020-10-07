export AUTH_USERNAME="language"
export AUTH_PASSWORD="awesumpassword123"
uwsgi --http :5000 --gevent 1000 --http-websockets --master --wsgi-file wsgi.py --callable application
