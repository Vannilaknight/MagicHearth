var jsonfile = require('jsonfile'),
    allSetsFile = "./CardBuilder/AllSets.json",
    sets = require('./sets.json'),
    BanList = require('./banList.json'),
    fs = require("fs");

return new Promise(function (resolve, reject) {
    jsonfile.readFile("./AllSets.json", function(err, AllSets) {

        for (var set in AllSets) {
            var set = AllSets[set];
            var cards = set.cards;

            cards.forEach(function (card, cardNum) {
                for (var bannedCard in BanList) {
                    var bannedCardFormat = BanList[bannedCard];
                    if (bannedCardFormat == "modern") {
                        sets.modern.forEach(function (setName) {
                            if (card.set == setName) {
                                if (card.name == bannedCard) {
                                    card.banned = true;
                                }
                            }
                        });
                    } else if (bannedCardFormat == "standard") {
                        sets.standard.forEach(function (setName) {
                            if (card.set == setName) {
                                if (card.name == bannedCard) {
                                    card.banned = true;
                                }
                            }
                        });
                    }
                }
            });
        }

        jsonfile.writeFile(allSetsFile, AllSets, function (err) {
            if(err) reject(err);
            console.log("BANS APPLIED");
            resolve();
        })
    });
});