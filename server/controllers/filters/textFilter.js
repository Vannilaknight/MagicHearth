module.exports = function filterText(searchText, cards) {
    if('@'.test(searchText)) {
        var searchBy = searchText.split('@');
        console.log(searchBy);
        cards = filterText(searchBy[0], cards);
        cards = filterText(searchBy[1], cards);
        return cards;
    }

    var subtypes = getSubtypes(searchText);
    var cardText = getCardText(searchText);
    var pwrTough = getPowerToughness(searchText);

    if(pwrTough) {
        cards = checkPowerToughness(pwrTough, cards);
    } else {
        if(subtypes){
            checkSubTypes(subtypes, cards);
        }
        if(cardText){
            checkCardText(cardText, cards);
        }
    }

    return cards;
};
function checkPowerToughness(text, cards) {
    var pwrTghVal = text[0].split("/");
    var hasPower = pwrTghVal[0].toLowerCase() != "x";
    var hasToughness = pwrTghVal[1].toLowerCase() != "x";

    cards = cards.filter(function (card) {
        var result = false;

        if(!hasPower && hasToughness) {
            result = card.toughness == pwrTghVal[1];
        }
        else if (hasPower && !hasToughness) {
            result = card.power == pwrTghVal[0];
        }
        else if (hasPower && hasToughness) {
            result = card.power == pwrTghVal[0]
                && card.toughness == pwrTghVal[1];
        }

        return result;
    });
    return cards;
};
function checkSubTypes(text, cards) {
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

    return cards;
};
function checkCardText(text, cards) {
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
function getPowerToughness(text) {
    var result = text.match(/\(.*?\)/g);
    if(result) {
        result = result.map(function(el) { return el.replace(/^\(|\)$/g, '')})
    }
    return result;
}