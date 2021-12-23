# CFO CA

## Pre-requisite

- python 3.6
- mysql
- redis-server

## Setup


The first thing to do is to clone the repository:

```sh
$ git clone https://github.com/AmbrosialTechnologies/CFO_CA.git
$ cd CFO_CA
```

Create a virtual environment to install dependencies in and activate it:

```sh
$ python3.6 -m venv env
$ source env/bin/activate
```

Then install the dependencies:

```sh
(env)$ pip install -r requirements.txt
```
Note the `(env)` in front of the prompt. This indicates that this terminal

## Setup envirnment veriables

Rename `.env.example` => `.env`

Update application credintials dev/prod/test respectively.

```sh
$ nano .env

DEBUG=on
SECRET_KEY=****
DB_NAME=******
DB_USER=*****
DB_PASSWORD=*****
DB_HOST=*****
DB_PORT=*****


EMAIL_HOST=smtp.gmail.com
EMAIL_USE_TLS=on
EMAIL_PORT=587
EMAIL_HOST_USER=****@gmail.com
EMAIL_HOST_PASSWORD=****
```

 
 ## Start server

 ### Start django application
```sh
(env)$ cd cfo_ca
(env)$ python manage.py runserver
```
And navigate to `http://127.0.0.1:8000`.

### Start mysql and redis-server
```sh
(env)$ sudo service mysql start 
(env)$ redis-server
```

### Start celery-worker
Run following command from project root dir
```sh
(env)$ celery -A cfo_ca worker -l INFO

(env)$ celery -A cfo_ca worker -l INFO --without-gossip --without-mingle --without-heartbeat -Ofair --pool=solo #In windows

```

### Start celery-beat
```sh
(env)$ celery -A cfo_ca beat -l INFO
```

