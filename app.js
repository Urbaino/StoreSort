var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var routes = require('./routes/index');
var list = require('./routes/list');

var app = express();

var data = require('./common/data');
var secrets = require('./common/secrets');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({ secret: secrets.SessionSecret}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/list', list);

// Passport
passport.serializeUser(function(user, done) {
  //console.log("serializeUser");
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  //console.log("deserializeUser");
  obj.isAdmin = data.getAdmin(obj.id) != null;
  done(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: secrets.GoogleClientID,
  clientSecret: secrets.GoogleClientSecret,
  callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //console.log("profile:" + profile);
      return done(null, profile);
    });
  }
));

app.get('/auth/google',
passport.authenticate('google', {scope : ["profile"]})
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


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
