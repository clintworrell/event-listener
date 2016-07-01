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
      id: req.session.id,
      newMessage: req.session.newMessage
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
      id: req.session.id,
      newMessage: req.session.newMessage
    })
  });
});

router.get('/:userId/messages/:messageId', function(req, res, next) {
  knex('messages').select('messages.id', 'messages.subject', 'messages.date', 'messages.body', 'users.username', 'messages.receiver')
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
      id: req.session.id,
      newMessage: req.session.newMessage
    });
  });
});

router.get('/:userId/events', function(req, res, next) {
  let currentPage = 1;
  if (req.query.page) {
    let pageQuery = parseInt(req.query.page);
    if (pageQuery > 0) {
      currentPage = pageQuery;
    } else {
      res.redirect('/users/' + req.session.id + '/events');
    }
  }
  knex('events').limit(5).offset((currentPage-1) * 5)
  .join('users_events', 'users_events.event_id', 'events.id')
  .where('users_events.user_id', req.session.id)
  .then(function(userEvents) {
    res.render('events', {
      title: "Saved Events",
      events: userEvents,
      username: req.session.username,
      id: req.session.id,
      newMessage: req.session.newMessage,
      currentPage: currentPage
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
        res.json("Message sent.");
      })
    } else {
      res.json("User not found.");
    }
  });
});

router.delete('/:userId/messages/:messageId', function(req, res, next) {
  knex('messages')
  .where('id', req.body.id)
  .delete()
  .returning('*')
  .then(function(deletedMessage) {
    res.json(deletedMessage);
  });
});

router.delete('/:userId/messages', function(req, res, next) {
  let messageIds = req.body['messageIds[]'];
  let messagePromises = [];
  if (Array.isArray(messageIds)) {
    messageIds.forEach(function(messageId) {
      messagePromises.push(knex('messages')
      .where('id', messageId)
      .delete()
      .returning('*'))
    });
    Promise.all(messagePromises)
    .then(function(deletedMessages) {
      res.json("Deleted messages.");
    })
  } else {
    knex('messages')
    .where('id', messageIds)
    .delete()
    .returning('*')
    .then(function(deletedMessage) {
      res.json("Deleted message.");
    })
  }
});

router.delete('/:userId/events/:eventId', function(req, res, next) {
  knex('users_events')
  .where('user_id', req.body.user_id)
  .andWhere('event_id', req.body.event_id)
  .delete()
  .returning('*')
  .then(function(deletedEvent) {
    res.json("Deleted event.");
  })
})

module.exports = router;
