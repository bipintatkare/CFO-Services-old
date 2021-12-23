# CFO CA Services (Front-End)

## Pre-requisite

- node
- npm

## Setup


The first thing to do is to clone the repository:

```sh
$ git clone https://github.com/AmbrosialTechnologies/CFO_CA.git
$ cd CFO_CA/cfo_ca/react-ui
```

Install dependencies:

```sh
$ npm install
```

## Setup envirnment veriables
Create `.env` file in root of react-ui repository. Update application credintials dev/prod/test respectively.

```sh
$ nano .env

REACT_APP_DEFAULTAUTH=jwt

REACT_APP_APIKEY=***
REACT_APP_AUTHDOMAIN=***
REACT_APP_DATABASEURL=***
REACT_APP_PROJECTID=***
REACT_APP_STORAGEBUCKET=***
REACT_APP_MESSAGINGSENDERID=***
REACT_APP_APPID=***
REACT_APP_MEASUREMENTID=***
REACT_APP_BASEURL_BACKEND=http://localhost:8000

```

 
## Start server

```sh
$ npm run start
```
And navigate to `http://127.0.0.1:3000`.


## Crate production build

```sh
$ npm run build
```