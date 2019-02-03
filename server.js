'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const passport = require('passport');
const session = require('express-session');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const routes = require('./routes.js'); // local routes
const auth = require('./auth.js');

const app = express();

// const db = mongo.connect('mongodb://DB_USERNAME:DB_PASSWORD@ds119652.mlab.com:19652/fcc-test-db');

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');

mongo.connect(process.env.DATABASE, (err, db) => {
  
  auth(app, db); // all authorization for server
  routes(app, db); // all routes for server
  
  if(err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successfully connected to database.');

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});
