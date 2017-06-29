String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function randomPrecise(minimum, maximum, precision) {
    minimum = minimum === undefined ? 0 : minimum;
    maximum = maximum === undefined ? 9007199254740992 : maximum;
    precision = precision === undefined ? 0 : precision;

    var random = Math.random() * (maximum - minimum + 1) + minimum;

    return random.toFixed(precision);
};

function objectToString(obj) {
    var returnStr = "";
    for (var prop in obj) {
        var value = obj[prop];
        if (value) {
            returnStr += "&" + prop + "=" + obj[prop];
        }
    }
    return returnStr;
}

function reduceArrayP2(cards) {
    var counts = {};

    cards.forEach(function (card) {
        if (!counts.hasOwnProperty(card.name)) {
            counts[card.name] = card;
            counts[card.name].count = 1;
        } else {
            counts[card.name].count += 1;
        }
    });

    var newArray = [];
    for (var name in counts) {
        var card = counts[name];
        if (card) {
            newArray.push(card);
        }
    }

    return newArray;
}

function objectValues(obj) {
    var res = [];
    for (var k in obj) res.push(obj[k]);
    return res;
}