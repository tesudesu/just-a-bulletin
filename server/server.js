require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/message');
const { body, validationResult } = require('express-validator');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI);

app.use(cors({
  origin: [
    "https://bulletin-b6k8.onrender.com",
    "http://localhost:3000"
  ],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api', (req, res) => {
  Message.find((err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json({ messages: data });
  });
});

app.post('/new', [
  body('user')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('A name must be entered'),
  body('text')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Some message must be provided'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  await Message.create({ user: req.body.user, text: req.body.text });
  Message.find((err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json({ messages: data });
  });
  console.log(req.body);
});

app.post('/find', [
  body('usersearch')
    .trim()
    .escape(),
  body('datefromsearch')
    .trim(),
  body('datetosearch')
    .trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  const { usersearch, datefromsearch, datetosearch } = req.body;

  if (!datefromsearch && !datetosearch) {
    Message.find({ user: usersearch }, (err, data) => {
      if (err) {
        console.log(err);
      }
      return res.json({ messages: data });
    });
  } else if (usersearch && datefromsearch && !datetosearch) {
    Message.find({
      user: usersearch,
      date: {
        $gte: new Date(datefromsearch).valueOf() + 28800000,
      }
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      return res.json({ messages: data });
    });
  } else if (usersearch && !datefromsearch && datetosearch) {
    Message.find({
      user: usersearch,
      date: {
        $lt: new Date(datetosearch).valueOf() + 28800000 + 86400000 
      }
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      return res.json({ messages: data });
    });
  } else if (!usersearch && datefromsearch && datetosearch) {
    Message.find({
      date: {
        $gte: new Date(datefromsearch).valueOf() + 28800000,
        $lt: new Date(datetosearch).valueOf() + 28800000 + 86400000
      }
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      return res.json({ messages: data });
    });
  } else if (!usersearch && datefromsearch && !datetosearch) {
    Message.find({
      date: {
        $gte: new Date(datefromsearch).valueOf() + 28800000,
      }
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      return res.json({ messages: data });
    });
  } else if (!usersearch && !datefromsearch && datetosearch) {
    Message.find({
      date: {
        $lt: new Date(datetosearch).valueOf() + 28800000 + 86400000
      }
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      return res.json({ messages: data });
    });
  } else if (usersearch && datefromsearch && datetosearch) {
    Message.find({
      user: usersearch,
      date: {
        $gte: new Date(datefromsearch).valueOf() + 28800000,
        $lt: new Date(datetosearch).valueOf() + 28800000 + 86400000
      }
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
      return res.json({ messages: data });
    });
  }
  console.log(req.body);
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
