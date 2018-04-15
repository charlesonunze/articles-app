const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {Article} = require('../server/models/article');
const {ObjectID} = require('mongodb');

// route for adding an article...
router
  .get('/add', (req, res) => {
    res.render('add-article');
  })
  .post('/add', (req, res) => {
    let body = _.pick(req.body, ['title', 'body']);
    let user = req.user.username;
    const article = new Article({title: body.title, author: user, body: body.body});

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

// route for getting an article and deleting...
router
  .get('/:id', (req, res) => {
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
  })
  .post('/:id', (req, res) => {
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

// route for editing an article...
router
  .get('/edit/:id', (req, res) => {
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
  })
  .post('/edit/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['title', 'body']);

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
        
        req.flash('success_msg', 'article updated...');
        res.redirect(`/article/${id}`);
      })
      .catch((e) => {
        res
          .status(400)
          .send(e);
      });
  });

module.exports = router;
