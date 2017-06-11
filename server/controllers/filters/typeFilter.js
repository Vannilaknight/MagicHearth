module.exports = function filterType(type, cards) {
    if (type != 'none') {
        cards = cards.filter(function (card) {
            var result = false;
            if(card.types) {
                card.types.forEach(function (cardType) {
                    if(type.toLowerCase() == cardType.toLowerCase()){
                        result = true;
                    }
                })
            }
            return result;
        });
    }
    return cards;
};