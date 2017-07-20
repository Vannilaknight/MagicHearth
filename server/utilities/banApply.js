var Sets = require("./../controllers/Data/Modern.json"),
    BanList = require("./../controllers/Data/banList.json"),
    fs = require("fs");

Sets.forEach(function (set, setNum) {
    set.cards.forEach(function (card, cardNum) {
        for(var bannedCard in BanList){
            if(card.name == bannedCard) {
                card.banned = true;
                console.log(setNum, cardNum);
            }
        }
    });
});

var json = JSON.stringify(Sets);
fs.writeFile("./../controllers/Modern.json", json, function (err) {
    if(err) throw err;
    console.log("COMPLETE")
});