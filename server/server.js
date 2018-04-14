const hbs = require('hbs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');

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
//
let articlesRoute = require('../routes/articles');
app.use('/article', articlesRoute);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
