var AllSets = require("./../controllers/AllSets.json"),
    fs = require("fs");

for (var set in AllSets) {
    var set = AllSets[set];
    var cards = set.cards;

    cards.forEach(function (card) {
        var code = set.code.toLowerCase();
        if(set.magicCardsInfoCode){
            code = set.magicCardsInfoCode.toLowerCase();
        }
        card.set = code;
    });
}

var json = JSON.stringify(AllSets);
fs.writeFile("./server/controllers/AllSets.json", json, function (err) {
    if(err) throw err;
    console.log("COMPLETE")
});