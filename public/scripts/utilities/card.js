function applyFilters(cards, typeFilter, colorFilter, costFilter, rarityFilter, formatFilter) {
    //Format
    if (formatFilter && formatFilter != "") {
        cards = cards.filter(function (card) {
            return card.format.includes(formatFilter);
        });
    }


    //Type
    if (typeFilter && typeFilter.length > 0) {
        cards = cards.filter(function (card) {
            var ret = false;
            typeFilter.forEach(function (type) {
                card.types.forEach(function (cardType) {
                    if (type.id == cardType) {
                        ret = true;
                    }
                });
            });
            return ret;
        });
    }


    //Color
    if (colorFilter && colorFilter.length > 0) {
        cards = cards.filter(function (card) {
            var ret = false;
            colorFilter.forEach(function (color) {
                card.colorIdentity.forEach(function (cardColor) {
                    if (color == cardColor) {
                        ret = true;
                    }
                });
            });
            return ret;
        });
    }


    //Cost
    if (costFilter && costFilter.length > 0) {
        cards = cards.filter(function (card) {
            var ret = false;
            costFilter.forEach(function (cost) {
                if (cost >= 8) {
                    if (card.cmc >= cost) {
                        ret = true;
                    }
                } else {
                    if (card.cmc == cost) {
                        ret = true;
                    }
                }
            });
            return ret;
        });
    }


    //Rarity
    if (rarityFilter && rarityFilter.length > 0) {
        cards = cards.filter(function (card) {
            var ret = false;
            rarityFilter.forEach(function (rarity) {
                if (card.rarity == rarity) {
                    ret = true;
                }
            });
            return ret;
        });
    }

    return cards;
}

function applySearch(cards, searchText) {
    if (searchText != "" && searchText) {
        var splitText = /@/g;
        if (searchText.match(splitText)) {
            var searchBy = searchText.split('@');
            cards = filterTextProcess(searchBy[0], cards);
            if (searchBy[1]) {
                var regex = /(\(((\d|[x!X])\/(\d|[x|X]))\))/g
                if (searchBy[1].match(regex)) {
                    cards = filterTextProcess(searchBy[1], cards);
                }
            }
            return cards;
        }

        var subtypes = getSubtypes(searchText);
        var cardText = getCardText(searchText);
        var pwrTough = getPowerToughness(searchText);

        if (pwrTough) {
            cards = checkPowerToughness(pwrTough, cards);
        } else {
            var check = true;
            if (subtypes) {
                cards = checkSubTypes(subtypes, cards);
                check = false;
            }
            if (cardText) {
                cards = checkCardText(cardText, cards);
                check = false;
            }

            if (check) {
                cards = checkAll(searchText, cards);
            }
        }
    }

    return cards;
}