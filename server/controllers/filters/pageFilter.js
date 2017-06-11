module.exports = function filterPage(page, cards) {
    var newCards = [];
    if (page > 0) {
        var indexStart = (page * 8) - 8;
        for (var x = indexStart; x < indexStart + 8; x++) {
            if (Object.values(cards)[x]) {
                newCards.push(Object.values(cards)[x]);
            }
        }
    } else {
        for (var x = 0; x < 8; x++) {
            if (Object.values(cards)[x]) {
                newCards.push(Object.values(cards)[x]);
            }
        }
    }
    return newCards;
}