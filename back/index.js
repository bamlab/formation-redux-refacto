const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function addComment(movie) {
  return {
    ...movie,
    comments: db.comments.filter(comment => comment.movie === movie.id),
  };
}
app.get('/users', function(req, res, next) {
  res.send(db.users);
});

app.get('/users/:id', function(req, res, next) {
  console.log(req.params);
  res.send(db.users[req.params.id]);
});
app.put('/users/1', function(req, res, next) {
  db.user = req.body;
  res.send(db.user);
});

app.get('/users/1/favorites', function(req, res, next) {
  res.send(db.favorites.map(addComment));
});

app.post('/users/1/favorites', function(req, res, next) {
  db.favorites.push(req.body);
  res.send(db.favorites.map(addComment));
});

app.get('/users/1/comments', function(req, res, next) {
  res.send(db.comments.filter(comment => comment.user === 1));
});

app.get('/movies', function(req, res, next) {
  res.send(db.movies.map(addComment));
});

app.get('/genres', function(req, res, next) {
  res.send(db.genres);
});

app.listen(port, function() {
  console.log(`The api is now running at http://localhost:${port}`);
});
