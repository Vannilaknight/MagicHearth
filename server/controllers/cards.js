var modernSet = require('./Modern.json'),
    standardSet = require('./Standard.json'),
    sets = require('./AllSets.json');

function arrayContainsAnotherArray(needle, haystack) {
    for (var i = 0; i < needle.length; i++) {
        if (haystack.indexOf(needle[i]) === -1)
            return false;
    }
    return true;
}

function getCards(req, res) {
    var page = req.query.page;
    var format = req.query.format;
    var colors = req.query.colors;
    var operator = req.query.op;
    var cardsToReturn;
    var cards = [];

    if (format) {
        if (format == "standard") {
            standardSet.forEach(function (set, ind, arr) {
                cards = cards.concat(set.cards);
            });
        } else if (format == "modern") {
            modernSet.forEach(function (set, ind, arr) {
                cards = cards.concat(set.cards);
            });
        }
    }

    if (colors) {
        var andColors;
        var splitColors;
        var and = false;
        if (operator == "and") {
            andColors = colors.split(",");
            and = true;
        } else {
            splitColors = colors.split(",");
        }

        var expectedTrues = 0;
        var andResults = [];

        var filteredCards = cards;

        console.log(andColors);

        filteredCards = filteredCards.filter(function (el) {
            andResults = [];
            var result = false;
            if (el.colorIdentity) {
                el.colorIdentity.forEach(function (cardColor) {
                    if (and) {
                        andColors.forEach(function (andColor) {
                            if (cardColor == andColor) {
                                andResults.push(true);
                            }
                        })
                    } else {
                        splitColors.forEach(function (filterColor) {
                            if (cardColor == filterColor) {
                                result = true;
                            }
                        });
                    }
                });
            }

            if (and) {
                console.log("AND");
                console.log(andResults);
                if (andResults.length == andColors.length) {
                    result = true;
                } else {
                    result = false;
                }
            }
            return result;
        });
        cards = filteredCards;
    }

    if (page > 0) {
        var indexStart = (page * 8) - 8;
        cardsToReturn = [];
        for (var x = indexStart; x < indexStart + 8; x++) {
            if(Object.values(cards)[x]){
                cardsToReturn.push(Object.values(cards)[x]);
            }
        }
    } else {
        cardsToReturn = [];
        for (var x = 0; x < 8; x++) {
            if(Object.values(cards)[x]){
                cardsToReturn.push(Object.values(cards)[x]);
            }
        }
    }
    res.send(cardsToReturn)
}

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

module.exports = {
    getCards
};