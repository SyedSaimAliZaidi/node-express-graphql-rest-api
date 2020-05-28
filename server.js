const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const logger = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// set port, listen for requests
const PORT = process.env.PORT || 2000;
let ip='124.29.212.143'
require('dotenv').config();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// logger
app.use(logger('dev'));

// bind express with graphql
app.use('/graphql', graphqlHTTP({
  // pass in a schema property
  schema,
  graphiql : true
}));

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.send({ message: "Welcome to application." });
});

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
});












