var modernSet = require('./Modern.json'),
    standardSet = require('./Standard.json'),
    sets = require('./AllSets.json');

function getCards(req, res) {
    var page = req.query.page;
    var format = req.query.format;
    var type = req.query.type;
    var rarities = req.query.rarities;
    var colors = req.query.colors;
    var cmcs = req.query.cmcs;
    var searchText = req.query.searchText;
    var colorOperator = req.query.colorop;
    var cards = [];

    if (format) {
        cards = filterFormat(format, cards);
    }

    if(type){
        cards = filterType(type, cards);
    }

    if (searchText) {
        cards = filterText(searchText, cards);
    }

    if (colors) {
        cards = filterColor(colors, colorOperator, cards)
    }

    if(rarities) {
        cards = filterRarity(rarities, cards)
    }

    if (cmcs) {
        cards = filterCMC(cmcs, cards);
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

function filterType(type, cards) {
    cards = cards.filter(function (card) {
        var result = false;
        if(card.types) {
            card.types.forEach(function (cardType) {
                if(type.toLowerCase() == cardType.toLowerCase()){
                    result = true;
                }
            })
        }
        return result;
    });
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
        } else {
                if (and) {
                    andColors.forEach(function (andColor) {
                        if (andColor == "C") {
                            andResults.push(true);
                        }
                    })
                } else {
                    splitColors.forEach(function (filterColor) {
                        if (filterColor == "C") {
                            result = true;
                        }
                    });
                }
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

function filterCMC(cmcs, cards) {
    var cmcs = cmcs.split(",");
    cards = cards.filter(function (card) {
        var result = false;
        cmcs.forEach(function (cmc) {
            if(cmc == card.cmc){
                result = true;
            } else {
                if(cmc == 8){
                    if(card.cmc >= 8){
                        result = true;
                    }
                }
            }
        })
        return result;
    });
    return cards;
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
                        if(subtypeSearch.toLowerCase() == subtypeResult.toLowerCase()){
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
                    if(card.text.toLowerCase().includes(cardTextSearch.toLowerCase())){
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
                if (subtype.toLowerCase().includes(searchText.toLowerCase())) {
                    contains = true;
                }
            });
        }
        if (card.text) {
            if (card.text.toLowerCase().includes(searchText.toLowerCase())) {
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

function filterRarity(rarities, cards){
    rarities = rarities.split(",");
    cards = cards.filter(function (card) {
        var result = false;
        rarities.forEach(function (rarity) {
            if(rarity == card.rarity){
                result = true;
            }
        });
        return result;
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