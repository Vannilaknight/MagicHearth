module.exports = function filterColor(colors, operator, cards) {
    var andColors;
    var splitColors;
    var and = false;
    var only = false;

    if(operator) {
        var operators = operator.split(',');
        console.log(operators);
        operators.forEach(function (op) {
            if(op == "only") {
                splitColors = colors.split(",");
                only = true;
            }

            if (op == "and") {
                andColors = colors.split(",");
                and = true;
            }
        })
    } else {
        splitColors = colors.split(",");
    }

    var andResults = [];

    var filteredCards = cards;

    filteredCards = filteredCards.filter(function (card) {
        andResults = [];
        var result = false;

        if (card.colorIdentity) {
            card.colorIdentity.forEach(function (cardColor) {
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
            result = andResults.length == andColors.length;
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