var Standard = require("./../controllers/Data/Modern.json"),
    fs = require("fs");

for (var set in Standard) {
    var set = Standard[set];
    var cards = set.cards;
    set.cardCount = cards.length;
}

var json = JSON.stringify(Standard);
fs.writeFile("Modern.json", json, function (err) {
    if(err) throw err;
    console.log("COMPLETE")
});