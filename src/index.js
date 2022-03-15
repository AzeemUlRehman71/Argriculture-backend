
const express = require('express');
const bodyParser = require('body-parser');
require('module-alias/register')
require('dotenv').config()
const dbConfig = require('@Config/db.config.js');
const mongoose = require('mongoose');
const path = require('path')


// create express app
const app = express();

// Connecting to the database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.development.connectionUrl, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
  }).then(() => {
    let dbStatus = ''
    dbStatus = `*    DB Connection: OK\n****************************\n`
    if (process.env.NODE_ENV !== 'test') {
      // Prints initialization
      console.log('****************************')
      console.log('*    Starting Server')
      console.log(`*    Port: ${process.env.PORT || 4000}`)
      console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
      console.log(`*    Database: MongoDB`)
      console.log(dbStatus)
    }
  }).catch(err => {
      let dbStatus = ''
      if (err) {
        dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`
      }
      process.exit();
});

app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "pug");

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse requests of content-type - application/json
app.use(bodyParser.json());


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to MybtLLc application."});
});
const systemRoute = require('@Providers/RouteServiceProvider');
systemRoute.register(app);

// listen for requests
app.listen(4000, () => {
    // console.log("Server is listening on port 4000");
});

