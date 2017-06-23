String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
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

var myCounter = 0,
    myOtherCounter = 0;
var scroll = 0;

//Firefox
// $(document).bind(...) this works as well
$('body').bind('DOMMouseScroll', function (e) {
    if (e.originalEvent.detail > 0) {
        scrollDown();
    } else {
        scrollUp();
    }

    //prevent page fom scrolling
    return false;
});

//IE, Opera, Safari
$('body').bind('mousewheel', function (e) {
    if (e.originalEvent.wheelDelta < 0) {
        scrollDown();
    } else {
        scrollUp();
    }
    //prevent page fom scrolling
    return false;
});

function scrollDown() {
    if (scroll < $('#display-box').find('div').height() - $('#display-box').height() + 20) {
        scroll = $('#display-box').scrollTop() + 8;
        $('#display-box').scrollTop(scroll);
    }
};

function scrollUp() {
    if (scroll > 0) {
        scroll = $('#display-box').scrollTop() - 8;
        $('#display-box').scrollTop(scroll);
    }
};

function objectValues(obj) {
    var res = [];
    for (var k in obj) res.push(obj[k]);
    return res;
}