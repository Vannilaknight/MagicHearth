var jsonfile = require('jsonfile'),
    fs = require("fs");
var allSetsFile = "./CardBuilder/AllSets.json";


return new Promise(function (resolve, reject) {
    jsonfile.readFile("./AllSets.json", function(err, AllSets) {
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

        jsonfile.writeFile(allSetsFile, AllSets, function (err) {
            if(err) reject(err);
            console.log("SETS SET");
            resolve();
        })
    });
});