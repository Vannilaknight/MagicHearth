module.exports = function filterRarity(rarities, cards){
    rarities = rarities.split(",");
    cards = cards.filter(function (card) {
        var result = false;
        rarities.forEach(function (rarity) {
            if(rarity == card.rarity){
                result = true;
            }
        });
        return result;
    });
    return cards;
}
