const _ = require('lodash');
const hbs = require('hbs');
const path = require('path');
const bcrypt = require('bcryptjs');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
// const messages = require('express-messages');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Article} = require('./models/article');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '../views/partials'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(session({
  cookie: {
    maxAge: 60000
  },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  // res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  Article
    .find({})
    .then((articles) => {
      if (articles.length === 0) 
        return console.log(`ID not found`);
      res.render('index', {articles});
    });
});

app.get('/articles/add', (req, res) => {
  res.render('add-article');
});

app.post('/articles/add', (req, res) => {
  let body = _.pick(req.body, ['title', 'author', 'body']);

  const article = new Article({title: body.title, author: body.author, body: body.body});

  article
    .save()
    .then((doc) => {
      req.flash('success_msg', 'new article added');
      res.redirect('/');
    })
    .catch((e) => {
      res
        .status(400)
        .send(e);
    });
});

app.get('/article/:id', (req, res) => {
  Article
    .findById(req.params.id)
    .then((article) => {
      res.render('article', {article});
    })
    .catch((e) => {
      res
        .status(400)
        .send(e);
    });
});

app.get('/article/edit/:id', (req, res) => {
  Article
    .findById(req.params.id)
    .then((article) => {
      res.render('edit-article', {article});
    })
    .catch((e) => {
      res
        .status(400)
        .send(e);
    });
});

app.post('/article/edit/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['title', 'author', 'body']);

  // validateID(id)
  if (!ObjectID.isValid(id)) 
    return res
      .status(404)
      .send({Error: 'Invalid ID'});
  
  Article
    .findOneAndUpdate({
      _id: id
    }, {
      $set: body
    }, {new: true})
    .then((article) => {
      if (!article) 
        return res
          .status(404)
          .send({Error: 'Page not found'});
      
      res.redirect(`/article/${id}`);
    })
    .catch((e) => {
      res
        .status(400)
        .send(e);
    });
});
// delete
app.post('/article/:id', (req, res) => {

  Article
    .findByIdAndRemove(req.params.id)
    .then((article) => {
      if (!article) 
        return res
          .status(404)
          .send({Error: 'Page not found'});
      req.flash('success_msg', 'article deleted');
      res.redirect(301, '/');
    })
    .catch((e) => {
      res
        .status(400)
        .send(e);
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
