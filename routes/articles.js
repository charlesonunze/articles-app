const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Article = require("../server/models/article");
const User = require("../server/models/user");
const { ObjectID } = require("mongodb");

// access control
const protect = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  req.flash("error", "please log in");
  res.redirect("/users/login");
};

router.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// route for adding an article...
router
  .get("/add", protect, (req, res) => {
    res.render("add-article");
  })
  .post("/add", protect, (req, res) => {
    let body = _.pick(req.body, ["title", "body"]);
    const article = new Article({
      title: body.title,
      author: req.user.username,
      body: body.body
    });

    article
      .save()
      .then(doc => {
        req.flash("success", "new article added");
        res.redirect("/");
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });

// route for getting an article and deleting...
router
  .get("/:id", (req, res) => {
    Article.findById(req.params.id)
      .then(article => {
        res.render("article", { article });
      })
      .catch(e => {
        res.status(400).send(e);
      });
  })
  .post("/:id", protect, (req, res) => {
    Article.findByIdAndRemove(req.params.id)
      .then(article => {
        if (!article) return res.status(404).send({ Error: "Page not found" });
        req.flash("success", "article deleted");
        res.redirect(301, "/");
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });

// route for editing an article...
router
  .get("/edit/:id", protect, (req, res) => {
    Article.findById(req.params.id)
      .then(article => {
        res.render("edit-article", { article });
      })
      .catch(e => {
        res.status(400).send(e);
      });
  })
  .post("/edit/:id", protect, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["title", "body"]);

    // validateID(id)
    if (!ObjectID.isValid(id))
      return res.status(404).send({ Error: "Invalid ID" });

    Article.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: body
      },
      { new: true }
    )
      .then(article => {
        if (!article) return res.status(404).send({ Error: "Page not found" });

        req.flash("success", "article updated...");
        res.redirect(`/article/${id}`);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  });

module.exports = router;
