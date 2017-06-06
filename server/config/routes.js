var request = require('request'),
    cards = require('../controllers/cards');

module.exports = function (app, config) {

  app.get('/partials/*', function (req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.get('/api/cards', cards.getCards);
  app.get('/api/card', cards.searchForCard);

  app.all('/api/*', function (req, res) {
    res.send(404);
  });

  app.get('*', function (req, res) {
    res.render('index');
  });
};
