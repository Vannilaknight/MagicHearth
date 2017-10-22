var Mongoose = require('mongoose'),
    Card = Mongoose.model('Card');

exports.getCards = function (req, res, next) {
    Card.find({}).exec(function (err, collection) {
        res.send(collection);
    })
};

exports.getStandardCards = function (req, res, next) {
    Card.find({"format": "standard"}).exec(function (err, collection) {
        res.send(collection);
    })
};

exports.getModernCards = function (req, res, next) {
    Card.find({"format": "modern"}).exec(function (err, collection) {
        res.send(collection);
    })
};

exports.setCard = function (req, res, next) {
    var newCard = req.body.card;
    Card.update({_id: newCard._id}, newCard, function (err, raw) {
        if(err) console.error(err);
        res.send(raw);
    })
};

exports.buildImportedDeck = function (req, res) {
    var importedString = req.query.importedString;
    var newCards = [];
    if (importedString) {
        /* Regex:
         ((\d\dx|\dx)): split on either (\d\dx) or (\dx)
         */
        var regex = /(\d\dx|\dx|\d\d|\d)/g;
        var splitImportedString = importedString.split(regex);
        splitImportedString.splice(0, 1);
        var cardsToSearch = [];
        for (var i = 0; i < splitImportedString.length; i = i + 2) {
            var cardName = splitImportedString[(i + 1)].trim();
            var numOfCard = parseInt(splitImportedString[i].replace('x', ''));

            for(var x = 0; x < numOfCard; x++){
                cardsToSearch.push(Card.findOne({name: cardName}).exec());
            }
        }

        Promise.all(cardsToSearch).then(function (results) {
            res.send(results)
        });
    } else {
        res.send([]);
    }
};

