const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const passport = require("passport");

const User = require("../server/models/user");

// signup
router
  .get("/register", (req, res) => {
    res.render("signup");
  })
  .post("/register", (req, res) => {
    let body = _.pick(req.body, ["username", "password"]);

    const user = new User({ username: body.username, password: body.password });

    user
      .save()
      .then(doc => {
        req.flash("success", "account created, you can now log in");
        res.redirect("/users/login");
        console.log(doc);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });

// login
router
  .get("/login", (req, res) => {
    res.render("login");
  })
  .post("/login", (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true
    })(req, res, next);
  });

// logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "you are now logged out");
  res.redirect("/users/login");
});

module.exports = router;
