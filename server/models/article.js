const mongoose = require("mongoose");

// create model
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },

  author: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
