module.exports = function filterColor(colors, operator, cards) {
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