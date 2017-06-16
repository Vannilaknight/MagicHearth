angular.module('app').service('deckbuilderService', function ($http) {
    this.getCards = function (params) {
        return $http({
            method: 'GET',
            url: '/api/cards?' + objectToString(params)
        }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            console.error(response.data)
        });
    }

    this.getTotalCardCount = function (deck) {
        var total = 0;
        deck.forEach(function (card) {
            total += card.count;
        });
        return total;
    };

    this.getCardsLeft = function (displayCards, topCards, botCards) {
        var topUpdate = topCards;
        var botUpdate = botCards;
        for (var x = 0; x < topCards.length; x++) {
            var card = topCards[x];
            if (!card.cardsLeft) {
                card.cardsLeft = 4;
            }
            if (displayCards.length >= 1) {
                var notFound = true;
                displayCards.forEach(function (displayCard) {
                    if (card.name == displayCard.name) {
                        topUpdate[x].cardsLeft = 4 - displayCard.count;
                        notFound = false;
                    }
                });
                if (notFound) {
                    if (card.cardsLeft == 3) {
                        topUpdate[x].cardsLeft = 4;
                    }
                }
            } else {
                topUpdate[x].cardsLeft = 4;
            }
        }

        for (var x = 0; x < botCards.length; x++) {
            var card = botCards[x];
            if (!card.cardsLeft) {
                card.cardsLeft = 4;
            }
            if (displayCards.length >= 1) {
                var notFound = true;
                displayCards.forEach(function (displayCard) {
                    if (card.name == displayCard.name) {
                        botUpdate[x].cardsLeft = 4 - displayCard.count;
                        notFound = false;
                    }
                });
                if (notFound) {
                    if (card.cardsLeft == 3) {
                        botUpdate[x].cardsLeft = 4;
                    }
                }
            } else {
                botUpdate[x].cardsLeft = 4;
            }
        }

        return {
            topUpdate: topUpdate,
            botUpdate: botUpdate
        }
    }

    this.getSortedDisplayDeck = function (displayCards) {
        var creatures = [];
        var spells = [];
        var lands = [];
        var creatureRegXp = /Creature/;
        var landRegXp = /Land/;

        displayCards.forEach(function (card) {

            if(creatureRegXp.test(card.type)) {
                creatures.push(card);
            } else if (landRegXp.test(card.type)) {
                lands.push(card);
            } else {
                spells.push(card);
            }

        });
        creatures = sortByCMC(creatures);
        spells = sortByCMC(spells);

        return {
                creature: creatures,
                spell: spells,
                land: lands
        };
    }

    this.filterText = function (searchText, cards) {
        var subtypes = getSubtypes(searchText);
        var cardText = getCardText(searchText);
        var pwrTough = getPowerToughness(searchText);

        searchText = searchText.replace(/\(.*?\)/g, '');

        if(pwrTough) {
            var pwrTghVal = pwrTough[0].split("/");
            var hasPower = pwrTghVal[0] != "x" || pwrTghVal[0] != "X" ;
            var hasToughness = pwrTghVal[1] != "x" || pwrTghVal[1] != "X";

            cards = cards.filter(function (card) {
                var result = false;

                if(!hasPower && hasToughness) {
                    result = card.toughness == pwrTghVal[1];
                }
                else if (hasPower && !hasToughness) {
                    result = card.power == pwrTghVal[0];
                }
                else if (hasPower && hasToughness) {
                    result = card.power == pwrTghVal[0]
                        && card.toughness == pwrTghVal[1];
                }

                return result;
            });
        } else {
            searchText = searchText.replace(/\*.*?\*/g, "");
            searchText = searchText.replace(/".*?"/g, "");

            if(subtypes){
                cards = cards.filter(function (card) {
                    var result = false;
                    if(card.subtypes){
                        subtypes.forEach(function (subtypeSearch) {
                            card.subtypes.forEach(function (subtypeResult) {
                                if(subtypeSearch.toLowerCase() == subtypeResult.toLowerCase()){
                                    result = true;
                                }
                            });
                        })
                    }
                    return result;
                });
            }

            if(cardText){
                cards = cards.filter(function (card) {
                    var result = false;
                    if(card.text){
                        cardText.forEach(function (cardTextSearch) {
                            if(card.text.toLowerCase().includes(cardTextSearch.toLowerCase())){
                                result = true;
                            }
                        })
                    }
                    return result;
                })
            }


            cards = cards.filter(function (card) {
                var contains = false;
                if (card.subtypes) {
                    card.subtypes.forEach(function (subtype) {
                        if (subtype.toLowerCase().includes(searchText.toLowerCase())) {
                            contains = true;
                        }
                    });
                }
                if (card.text) {
                    if (card.text.toLowerCase().includes(searchText.toLowerCase())) {
                        contains = true;
                    }
                }
                if (card.name.toLowerCase().includes(searchText.toLowerCase())) {
                    contains = true;
                }

                return contains;
            });
        }

        return cards;
    }

>>>>>>> 5761a1d7d458fa002982d1df69feff9db4679fb6
    function sortByCMC(cards) {
        var sortedArray = cards.sort(function (a, b) {
            return a.cmc - b.cmc;
        });
        return sortedArray;
    }

    function getSubtypes(text) {
        var result = text.match(/\*.*?\*/g);
        if(result){
            result = result.map(function(el) { return el.replace(/^\*|\*$/g, ""); });
        }
        return result;
    }

    function getCardText(text) {
        var result = text.match(/".*?"/g);
        if(result){
            result = result.map(function(el) { return el.replace(/^"|"$/g, ""); });
        }
        return result;
    }
    function getPowerToughness(text) {
        var result = text.match(/\(.*?\)/g);
        if(result) {
            result = result.map(function(el) { return el.replace(/^\(|\)$/g, '')})
        }
        return result;
    }
});