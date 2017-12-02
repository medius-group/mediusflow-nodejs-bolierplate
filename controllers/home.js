/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    res.render('home', {
      title: 'Home',
      displayName: req.user.displayName
    });
  };