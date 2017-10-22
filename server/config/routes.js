var auth = require('./auth'),
    request = require('request'),
    Auth = require('./auth'),
    users = require('../controllers/users'),
    cards = require('../controllers/cards'),
    edit = require('../controllers/cardEdit');

module.exports = function (app, config) {

    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/' + req.params[0]);
    });

    app.post('/api/admin', auth.requiresRole('admin'), users.createAdmin);

    app.get('/api/allSets', auth.requiresRole('admin'), edit.getAllSets);
    app.post('/api/card', cards.setCard);

    app.get('/api/allCards', cards.getCards);
    app.get('/api/standardCards', cards.getStandardCards);
    app.get('/api/modernCards', cards.getModernCards);

    app.get('/api/buildImport', cards.buildImportedDeck);

    app.all('/api/*', function (req, res) {
        res.send(404);
    });

    app.post('/login', Auth.authenticate);
    app.post('/logout', function (req, res) {
        req.logout();
        res.end();
    });

    app.post('/logout', function (req, res) {
        req.logout();
        res.end();
    });

    app.get('*', function (req, res) {
        res.render('index');
    });
};
