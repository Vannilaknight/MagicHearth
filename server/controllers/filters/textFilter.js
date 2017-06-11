module.exports = function filterText(searchText, cards) {
    var subtypes = getSubtypes(searchText);
    var cardText = getCardText(searchText);

    searchText = searchText.replace(/\*.*?\*/g, "");
    searchText = searchText.replace(/".*?"/g, "");

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
        if (card.name.toLowerCase().includes(searchText.toLowerCase())) {
            contains = true;
        }

        return contains;
    });
    return cards;
};

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