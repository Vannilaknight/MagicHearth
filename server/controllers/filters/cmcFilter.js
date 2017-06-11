module.exports = function filterCMC(cmcs, cards) {
    var cmcs = cmcs.split(",");
    cards = cards.filter(function (card) {
        var result = false;
        cmcs.forEach(function (cmc) {
            if(cmc == card.cmc){
                result = true;
            } else {
                if(cmc == 8){
                    if(card.cmc >= 8){
                        result = true;
                    }
                }
            }
        });
        return result;
    });
    return cards;
};