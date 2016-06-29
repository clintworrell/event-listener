"use strict";

let express = require('express'),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    cookieSession = require("cookie-session"),
    bodyParser = require('body-parser'),

    geoip = require('./routes/geoip'),

    routes = require('./routes/index'),
    users = require('./routes/users'),
    events = require('./routes/events'),
    usersApi = require('./routes/api/v1/users'),
    eventsApi = require('./routes/api/v1/events');

require('dotenv').load();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieSession({
  keys: [
    process.env.SESSION_KEY1,
    process.env.SESSION_KEY2,
    process.env.SESSION_KEY3
  ]
}));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public/favicomatic/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/geoip', geoip);
app.use('/', routes);
app.use('/users', users);
app.use('/events', events);
app.use('/api/v1/users', usersApi);
app.use('/api/v1/events', eventsApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
