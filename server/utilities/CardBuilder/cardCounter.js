var allSetsFile = "./CardBuilder/AllSets.json",
    AllSets = require("./AllSets.json"),
    fs = require("fs");

for (var set in AllSets) {
    var set = AllSets[set];
    var cards = set.cards;

    set.cardCount = cards.length;
}

var json = JSON.stringify(AllSets);
fs.writeFile(allSetsFile, json, function (err) {
    if(err) throw err;
    console.log("CARDS COUNTED")
});