var allSetsFile = "./CardBuilder/AllSets.json",
    AllSets = require("./AllSets.json"),
    sets = require('./sets.json'),
    BanList = require('./banList.json'),
    fs = require("fs");

for (var set in AllSets) {
    var set = AllSets[set];
    var cards = set.cards;

    cards.forEach(function (card, cardNum) {
        for(var bannedCard in BanList){
            var bannedCardFormat = BanList[bannedCard];
            if(bannedCardFormat == "modern"){
                sets.modern.forEach(function (setName) {
                    if(card.set == setName){
                        if(card.name == bannedCard) {
                            card.banned = true;
                        }
                    }
                });
            } else if (bannedCardFormat == "standard") {
                sets.standard.forEach(function (setName) {
                    if(card.set == setName){
                        if(card.name == bannedCard) {
                            card.banned = true;
                        }
                    }
                });
            }
        }
    });
}

var json = JSON.stringify(AllSets);
fs.writeFile(allSetsFile, json, function (err) {
    if(err) throw err;
    console.log("CARDS BANNED")
});