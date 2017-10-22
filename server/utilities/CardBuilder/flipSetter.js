var jsonfile = require('jsonfile'),
    allSetsFile = "./CardBuilder/AllSets.json",
    fs = require("fs");

return new Promise(function (resolve, reject) {
    var toRemove = [];

    jsonfile.readFile("./AllSets.json", function(err, AllSets) {
        for (var set in AllSets) {
            var set = AllSets[set];
            var cards = set.cards;

            cards.forEach(function (card) {
                if (card.names) {
                    if (card.names.length > 1) {
                        if (card.names[0] == card.name) {
                            card.secondary = getCard(card.names[1]);
                        }
                    }
                }
            });

            cards = cards.filter(function (card) {
                var result;
                toRemove.forEach(function (cardToRemove) {
                    result = cardToRemove == card.name;
                    if (result) {
                        // console.log(cardToRemove + " <- " + card.name)
                    }
                });
                return !result;
            });

            toRemove = [];
        }

        jsonfile.writeFile(allSetsFile, AllSets, function (err) {
            if(err) reject(err);
            console.log("DUEL USE FORMATTED");
            resolve();
        })
    });

    function getCard(name) {
        var retCard;
        for (var set in AllSets) {
            var set = AllSets[set];
            var cards = set.cards;


            cards.forEach(function (card, index) {
                if (card.name == name) {
                    retCard = card;
                    toRemove.push(card.name);
                }
            });
        }
        return retCard;
    }
});
