// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const data = require('./data');
const port = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(cors());

app.get('/posts/:postId/comments', (req, res) => {
  const postId = Number(req.params.postId);
  const comments = data.comments.filter(comment => comment.postId === postId);
  res.json(comments);
});

app.post('/posts/:postId/comments', (req, res) => {
  const postId = Number(req.params.postId);
  const newComment = {
    ...req.body,
    postId,
    id: data.comments.length + 1,
  };
  data.comments.push(newComment);
  res.status(201).send(newComment);
});

app.put('/posts/:postId/comments/:commentId', (req, res) => {
  const commentId = Number(req.params.commentId);
  const commentIndex = data.comments.findIndex(comment => comment.id === commentId);
  if (commentIndex !== -1) {
    const originalComment = data.comments[commentIndex];
    const newComment = {
      ...originalComment,
      ...req.body,
    };
    data.comments[commentIndex] = newComment;
    res.send(newComment);
  } else {
    res.status(404).send();
  }
});

app.delete('/posts/:postId/comments/:commentId', (req, res) => {
  const commentId = Number(req.params.commentId);
  const commentIndex = data.comments.findIndex(comment => comment.id === commentId);
  if (commentIndex !== -1) {
    data.comments.splice(commentIndex, 1);
  }
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Comments Service listening on port ${port}`);
});