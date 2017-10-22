var jsonfile = require('jsonfile'),
    allSetsFile = "./CardBuilder/AllSets.json",
    fs = require("fs");

return new Promise(function (resolve, reject) {
    jsonfile.readFile("./AllSets.json", function(err, AllSets) {
        for (var set in AllSets) {
            var set = AllSets[set];
            var cards = set.cards;

            set.cardCount = cards.length;
        }

        jsonfile.writeFile(allSetsFile, AllSets, function (err) {
            if(err) reject(err);
            console.log("CARDS COUNTED");
            resolve();
        })
    });
});
