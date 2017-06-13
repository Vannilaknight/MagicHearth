module.exports = function filterColor(colors, operator, cards) {
    var andColors;
    var splitColors;
    var and = false;
    var only = false;

    if(operator) {
        only = operator.match("only");
        and = operator.match("and");
    }

    var andResults = [];
    var filteredCards = cards;

    filteredCards = filteredCards.filter(function (card) {
        andResults = [];
        var result = false;
        if (card.colorIdentity) {
            card.colorIdentity.forEach(function (cardColor) {
                if(colors.match(cardColor) && and) {
                    andResults.push(true);
                }
                else if (colors.match(cardColor)){
                    result = true;
                }
            });
        } else {

            if(colors.match("C") && and) {
                andResults.push(true);
            } else if(colors.match("C")) {
                result = true;
            }
        }
        if (and) {
            result = andResults.length == colors.length;
        }

        if(only){
            if(card.colorIdentity) {
                card.colorIdentity.forEach(function (cardColor) {
                    if(colors.match(cardColor) && result) {
                        result = true;
                    }
                    else {
                        result = false;
                    }
                });
            }
        }

        return result;
    });
    return filteredCards;
}