/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'Login'
  });
};
