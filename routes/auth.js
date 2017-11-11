var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/start', function(req, res, next) {
  res.redirect('https://cloud.mediusflow.com/rndQA/oauth/authorize?response_type=code&client_id=f936951e8b2192a7fe95c13abcbb1d6e&state=xyz&redirect_uri=http://localhost:3000/auth/callback&scope=openid');
});

router.get('/callback', function(req, res, next) {
  console.log(req.query);
  
  var request = require('request');
  request.post({url: 'https://cloud.mediusflow.com/rndQA/api/connect/token', form: {
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri: 'http://localhost:3000/auth/callback',
    scope: 'openid',
    client_id: 'f936951e8b2192a7fe95c13abcbb1d6e',
    client_secret: 'Kn30eo4Yx-xc2UOn45SekTz2W5zn2-6Pb5-CeIPEytg'
  }}, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    console.log(JSON.parse(body).access_token);
    request.get({url: 'https://cloud.mediusflow.com/rndQA/api/connect/userinfo', headers: {
      Authorization: JSON.parse(body).token_type + ' ' + JSON.parse(body).access_token
    }}, function(err, resp, body) {
      console.log('error:', err); // Print the error if one occurred
      console.log('statusCode:', resp && resp.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      res.send('Great. Your name is: ' + JSON.parse(body).name);
    })

   
  });
  
});

module.exports = router;
