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
        var creatureRegXp = '/Creature/g';
        var landRegXp = '/Land/g';

        displayCards.forEach(function (card) {
            if(creatureRegXp.test(card.type.test)) {
                creatures.push(card);
            } else if (landRegXp.test(card.type.test)) {
                lands.push(card);
            } else {
                spells.push(card);
            }

        });
        creatures = sortByCMC(creatures);
        spells = sortByCMC(spells);

        return {creature: creatures,
                spell: spells,
                land: lands
        };
    }

    function sortByCMC(cards) {
        var sortedArray = cards.sort(function (a, b) {
            return a.cmc - b.cmc;
        });
        return sortedArray;
    }
});