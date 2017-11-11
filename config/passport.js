const passport = require('passport');
const OidcStrategy = require('../src/passport-openidconnect').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new OidcStrategy({
  authorizationURL: 'http://localhost',
  tokenURL: 'http://localhost',
  clientID: process.env.MEDIUSFLOW_ID,
  clientSecret: process.env.MEDIUSFLOW_SECRET,
  callbackURL: process.env.MEDIUSFLOW_CALLBACK_URI
}, function(token, tokenSecret, profile, cb) {
  return cb(null, profile);
  return cb(null, profile);
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
  
/**
    * Authorization Required middleware.
*/
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};