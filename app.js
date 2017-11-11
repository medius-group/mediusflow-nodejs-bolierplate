const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const OidcStrategy = require('./src/passport-openidconnect').Strategy;

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET , resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

/**
 * Primary app routes.
 */

app.get('/', passportConfig.isAuthenticated, homeController.index);
app.get('/login', userController.getLogin);

/**
 * OAuth authentication routes. (Sign in)
 */
/**
 * For some reason it does not work with /auth/mediusflow/:tenant here.
 */
app.get('/auth/mediusflow', function(req,res,next) {
  passport.authenticate('openidconnect', {
    authorizationURL: 'https://cloud.mediusflow.com/' + req.query.tenant + '/oauth/authorize',
    tokenURL: 'https://cloud.mediusflow.com/' + req.query.tenant + '/api/connect/token',
    userInfoURL: 'https://cloud.mediusflow.com/' + req.query.tenant + '/api/connect/userinfo'
  }
  ) (req,res,next);
});
app.post('/auth/mediusflow', passport.authenticate('openidconnect'));
app.get('/auth/mediusflow/callback', passport.authenticate('openidconnect', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
