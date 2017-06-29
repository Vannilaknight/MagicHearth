var Standard = require("./../controllers/Modern.json"),
    fs = require("fs");

for (var set in Standard) {
    var set = Standard[set];
    var cards = set.cards;

    cards.forEach(function (card) {
        var code = set.code.toLowerCase();
        if(set.oldCode){
            code = set.oldCode.toLowerCase();
        }
        card.set = code;
    });
}

var json = JSON.stringify(Standard);
fs.writeFile("Modern.json", json, function (err) {
    if(err) throw err;
    console.log("COMPLETE")
});