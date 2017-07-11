var request = require('request'),
    Auth = require('./auth'),
    cards = require('../controllers/cards');

module.exports = function (app, config) {

    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/' + req.params[0]);
    });

    app.get('/api/cards', cards.getCards);
    app.get('/api/buildImport', cards.buildImportedDeck);

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.post('/login', Auth.authenticate);

    app.post('/logout', function (req, res) {
        req.logout();
        res.end();
    });

    app.get('*', function (req, res) {
        res.render('index');
    });
};
