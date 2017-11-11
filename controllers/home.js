/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    console.log("I'm home!")
    res.render('home', {
      title: 'Home',
      displayName: req.user.displayName
    });
  };