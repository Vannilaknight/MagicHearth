var cardData = require('./filters/cardData'),
    typeFilter = require('./filters/typeFilter'),
    colorFilter = require('./filters/colorFilter'),
    rarityFilter = require('./filters/rarityFilter'),
    cmcFilter = require('./filters/cmcFilter'),
    pageFilter = require('./filters/pageFilter');


function getCards(req, res) {
    var format = req.query.format;
    var set = req.query.set;
    var type = req.query.type;
    var rarities = req.query.rarities;
    var colors = req.query.colors;
    var cmcs = req.query.cmcs;
    var colorOperator = req.query.colorop;
    var cards = [];

    if(set) {
        cards = cardData.filterSet(set, cards);
    } else if (format) {
        cards = cardData.filterFormat(format, cards);
    }

    if(type){
        cards = typeFilter(type, cards);
    }

    if (colors) {
        cards = colorFilter(colors, colorOperator, cards)
    }

    if(rarities) {
        cards = rarityFilter(rarities, cards)
    }

    if (cmcs) {
        cards = cmcFilter(cmcs, cards);
    }

    res.send(cards)
}

function buildImportedDeck(req, res) {
    var importedString = req.query.importedString;
    var newCards = [];

    if(importedString){
        /* Regex:
            ((\d\dx|\dx)): split on either (\d\dx) or (\dx)
        */

        var regex = /(\d\dx|\dx|\d\d|\d)/g;
        var splitImportedString = importedString.split(regex);
        splitImportedString.splice(0,1);
        console.log(splitImportedString[0]);
        for(var i = 0; i < splitImportedString.length; i = i+2) {
            var cardName = splitImportedString[(i+1)].trim();
            var numOfCard = parseInt(splitImportedString[i].replace('x', ''));

            var cardInfo = cardData.searchForCard(cardName);

            for (var j = numOfCard; j > 0; j--) {
                 newCards.push(cardInfo);
            }
        }
    }
    res.send(newCards);
}

module.exports = {
    getCards,
    buildImportedDeck
};

// Not in use
function getMultiverseId(imageName) {
    var multiverseId = 0;
    Object.values(sets).forEach(function (value, index, arr) {
        var cardsResults = value.cards;
        Object.values(cardsResults).forEach(function (card, index, arr) {
            if (card.imageName == imageName) {
                multiverseId = card.multiverseid;
            }
        });
    });
    return multiverseId;
}

function arrayContainsAnotherArray(needle, haystack) {
    for (var i = 0; i < needle.length; i++) {
        if (haystack.indexOf(needle[i]) === -1)
            return false;
    }
    return true;
}