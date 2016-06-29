"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt');

router.use('/:userId*', function(req, res, next) {
  if (req.session.id == req.params.userId) {
    next();
  } else {
    res.redirect("/");
  }
});

router.get('/:userId', function(req, res, next) {
  knex('users')
  .where('id', req.params.userId)
  .then(function(user) {
    res.render('main', {
      title: "Main",
      username: req.session.username,
      id: req.session.id
    });
  });
});

router.get('/:userId/messages', function(req, res, next) {
  knex('messages').select('messages.id', 'messages.subject', 'messages.date', 'messages.read', 'users.username')
  .join('users', 'users.id', 'messages.sender')
  .where('receiver', req.session.id)
  .then(function(messages) {
    res.render('messages', {
      title: "Messages",
      messages: messages,
      username: req.session.username,
      id: req.session.id
    })
  });
});

router.get('/:userId/messages/:messageId', function(req, res, next) {
  knex('messages').select('messages.id', 'messages.subject', 'messages.date', 'messages.body', 'users.username')
  .join('users', 'users.id', 'messages.sender')
  .where('receiver', req.session.id)
  .andWhere('messages.id', req.params.messageId)
  .first()
  .then(function(message) {
    if (message) {
      knex('messages')
      .where('id', message.id)
      .update({
        read: true
      })
      .returning('*')
      .then(function() {
        console.log("Message #" + message.id + " marked as read.")
      });
    }
    res.render('messages', {
      title: "Message",
      message: message ? message : null,
      username: req.session.username,
      id: req.session.id
    });
  });
});

router.get('/:userId/events', function(req, res, next) {
  knex('events')
  .join('users_events', 'users_events.event_id', 'events.id')
  .where('users_events.user_id', req.session.id)
  .then(function(userEvents) {
    res.render('events', {
      title: "Saved Events",
      events: userEvents,
      username: req.session.username,
      id: req.session.id
    })
  })
});

router.post('/:userId/messages', function(req, res, next) {
  knex('users').select('id')
  .where('username', req.body.receiver)
  .first()
  .then(function(receiver) {
    if (receiver) {
      knex('messages')
      .insert({
        sender: req.session.id,
        receiver: receiver.id,
        subject: req.body.subject,
        body: req.body.body
      })
      .returning('*')
      .then(function(message) {
        res.json(message);
      })
    } else {
      res.json("No user found");
    }
  });
});

module.exports = router;
