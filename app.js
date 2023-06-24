const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://0.0.0.0:27017/newWikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
  .get(async function(req, res) {
    try {
      const foundArticles = await Article.find({});
      res.send(foundArticles);
    } catch (err) {
      res.send(err);
    }
  })
  .post(async function(req, res) {
    try {
      const articles = await Article.find();
      res.send(articles);
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async function(req, res) {
    try {
      await Article.deleteMany({});
      res.send('Successfully deleted all articles.');
    } catch (err) {
      res.send(err);
    }
  });

app.route('/articles/:articleTitle')
  .get(async function(req, res) {
    try {
      const requestedTitle = req.params.articleTitle;
      const foundArticle = await Article.findOne({ title: requestedTitle });

      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send('No articles matching that title were found.');
      }
    } catch (err) {
      res.send(err);
    }
  })
  .put(async function(req, res) {
    try {
      const requestedTitle = req.params.articleTitle;
      const update = {
        title: req.body.title,
        content: req.body.content
      };

      await Article.updateOne({ title: requestedTitle }, update);
      res.send('Successfully updated article.');
    } catch (err) {
      res.send(err);
    }
  })
  .patch(async function(req, res) {
    try {
      const requestedTitle = req.params.articleTitle;
      const update = req.body;

      await Article.updateOne({ title: requestedTitle }, { $set: update });
      res.send('Successfully updated article.');
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async function(req, res) {
    try {
      const requestedTitle = req.params.articleTitle;

      await Article.deleteOne({ title: requestedTitle });
      res.send('Successfully deleted article.');
    } catch (err) {
      res.send(err);
    }
  });

app.listen(3000, function() {
  console.log('Server Started on port 3000');
});
