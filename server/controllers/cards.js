var modernSet = require('./Modern.json'),
    standardSet = require('./Standard.json'),
    sets = require('./AllSets.json');

function getCards(req, res) {
    var page = req.query.page;
    var format = req.query.format;
    var colors = req.query.colors;
    var cmc = req.query.cmc;
    var searchText = req.query.searchText;
    var colorOperator = req.query.colorop;
    var cmcOperator = req.query.cmcop;
    var cards = [];

    if (format) {
        cards = filterFormat(format, cards)
    }

    if (searchText) {
        cards = filterText(searchText, cards);
    }

    if (colors) {
        cards = filterColor(colors, colorOperator, cards)
    }

    if (cmc) {

    }

    if (page) {
        cards = filterPage(page, cards);
    }

    res.send(cards)
}

function filterFormat(format, cards) {
    if (format == "standard") {
        standardSet.forEach(function (set, ind, arr) {
            cards = cards.concat(set.cards);
        });
    } else if (format == "modern") {
        modernSet.forEach(function (set, ind, arr) {
            cards = cards.concat(set.cards);
        });
    }
    return cards;
}


function filterColor(colors, operator, cards) {
    var andColors;
    var splitColors;
    var and = false;
    if (operator == "and") {
        andColors = colors.split(",");
        and = true;
    } else {
        splitColors = colors.split(",");
    }

    var andResults = [];

    var filteredCards = cards;

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
            if (andResults.length == andColors.length) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    });
    return filteredCards;
}


function filterCMC() {

}

function filterText(searchText, cards) {
    var subtypes = getSubtypes(searchText);
    var cardText = getCardText(searchText);

    searchText = searchText.replace(/\*.*?\*/g, "");
    searchText = searchText.replace(/".*?"/g, "");

    console.log(searchText);
    if(subtypes){
        cards = cards.filter(function (card) {
            var result = false;
            if(card.subtypes){
                subtypes.forEach(function (subtypeSearch) {
                    card.subtypes.forEach(function (subtypeResult) {
                        if(subtypeSearch == subtypeResult){
                            result = true;
                        }
                    });
                })
            }
            return result;
        });
    }

    if(cardText){
        cards = cards.filter(function (card) {
            var result = false;
            if(card.text){
                cardText.forEach(function (cardTextSearch) {
                    if(card.text.includes(cardTextSearch)){
                        result = true;
                    }
                })
            }
            return result;
        })
    }

    cards = cards.filter(function (card) {
        var contains = false;
        if (card.subtypes) {
            card.subtypes.forEach(function (subtype) {
                if (subtype.includes(searchText)) {
                    contains = true;
                }
            });
        }
        if (card.text) {
            if (card.text.includes(searchText)) {
                contains = true;
            }
        }
        if (card.name.includes(searchText)) {
            contains = true;
        }

        return contains;
    });
    return cards;
}

function getSubtypes(text) {
    var result = text.match(/\*.*?\*/g);
    if(result){
        result = result.map(function(el) { return el.replace(/^\*|\*$/g, ""); });
    }
    return result;
}

function getCardText(text) {
    var result = text.match(/".*?"/g);
    if(result){
        result = result.map(function(el) { return el.replace(/^"|"$/g, ""); });
    }
    return result;
}

function filterPage(page, cards) {
    var newCards = [];
    if (page > 0) {
        var indexStart = (page * 8) - 8;
        for (var x = indexStart; x < indexStart + 8; x++) {
            if (Object.values(cards)[x]) {
                newCards.push(Object.values(cards)[x]);
            }
        }
    } else {
        for (var x = 0; x < 8; x++) {
            if (Object.values(cards)[x]) {
                newCards.push(Object.values(cards)[x]);
            }
        }
    }
    return newCards;
}

module.exports = {
    getCards
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