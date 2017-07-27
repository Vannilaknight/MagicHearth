var allSetsFile = "./CardBuilder/AllSets.json",
    AllSets = require("./AllSets.json"),
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
fs.writeFile(allSetsFile, json, function (err) {
    if(err) throw err;
    console.log("SETS SET")
});