const ejs = require("ejs");
const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");

// import models
const mongoose = require("./db/mongoose");
const Article = require("./models/article");

// import routes
const articlesRoute = require("../routes/articles");
const usersRoute = require("../routes/users");

const app = express();
const port = process.env.PORT || 3000;

// configs for the view engine
app.set("view engine", "ejs");

// configs for static files and bodyParser
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configs for cookieParser, session and flash
app.use(cookieParser());
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(flash());

// set global variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.message = req.flash("message");
  res.locals.error = req.flash("error");
  next();
});

// passport config
require("../config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// use imported routes
app.use("/article", articlesRoute);
app.use("/users", usersRoute);

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// home route
app.get("/", (req, res) => {
  Article.find({}).then(articles => {
    if (articles.length === 0) return res.render("index", { articles });
    res.render("index", { articles });
  });
});

// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
