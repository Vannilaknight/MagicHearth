var textFilter = require('./textFilter'),
    modernSet = require('./../Modern.json'),
    standardSet = require('./../Standard.json'),
    sets = require('./../AllSets.json');

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

function filterSet(set) {
    return sets[set].cards;
}

function searchForCard(searchText) {
    var cardName = searchText;

    var cards = filterFormat("modern", []);

    if(cardName) {
        if(cardName == "Plains" || cardName == "Swamp" || cardName == "Forest" || cardName == "Mountain" || cardName == "Island"){
            cards = filterLand(cardName, cards);
        } else {
            cards = filterName(cardName, cards);
        }
    }

    return cards[0];
}

function filterLand(searchText, cards) {
    cards = cards.filter(function (card) {
        var contains = false;
        if (card.rarity == "Basic Land") {
            if(card.name == searchText){
                contains = true;
            }
        }

        return contains;
    });
    return cards;
}

function filterName(searchName, cards) {
    return cards.filter(function (card) {
        return searchName == card.name;
    });
}

module.exports = {
    filterFormat,
    filterSet,
    searchForCard
};