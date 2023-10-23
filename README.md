# Artist website & webstore

## Description

The aim of this project is to build a showcase site fo an artist, which also allows the sale of his works.

The work is in progress and improvements are expected.

## Technologies

* Javascript ES6
* Nodejs
* ejs

### Features

Acount management:
* user can creat a client account and get acces to store features.

E-store:
* add or remove product to a cart.
* buy the content of the cart.

Custom order:
* clients can send a custom order directly to the artist.
* clients and the artist can communicate in a dedicated tchat box.



## Setup

installation:

`git clone https://github.com/DjackSs/Artist-website`


`npm install`

Run the application with:

`node server.js`


### .env file template:

Here are the global variables you will need :

#### server variable
```javascript
PORT=
SESSION_SECRET=
```

#### database variable
```javascript
DATA_HOST=
DATA_USER=
DATA_PW=
DATA_NAME=
```

#### stripe variable
```javascript
STRIPE_SK=
```


