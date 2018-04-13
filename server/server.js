const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '../views/partials'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
