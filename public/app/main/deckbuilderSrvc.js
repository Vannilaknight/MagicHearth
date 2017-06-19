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
    };

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
    };

    this.getSortedDisplayDeck = function (displayCards) {
        var creatures = [];
        var spells = [];
        var lands = [];
        var creatureRegXp = /Creature/;
        var landRegXp = /Land/;

        displayCards.forEach(function (card) {

            if (creatureRegXp.test(card.type)) {
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
    };
    this.suggestBasicLands = function (displayCards, maxLands) {
        var suggestLands = {
            "island": {},
            "plains": {},
            "swamp": {},
            "mountain": {},
            "forest": {},
        };
        var manaSymbols = {
            blue: 0,
            red: 0,
            green: 0,
            white: 0,
            black: 0,
            colorless: 0,
            totalManaSymbols: function getTotalManaSymbols() {
                return this.blue
                    + this.red
                    + this.green
                    + this.white
                    + this.black;
            }
        };

        displayCards.forEach(function (card) {
            var numOfCard = displayCards[displayCards.indexOf(card)].count;

            if (card.text) {
                var greenMatch = card.text.match(/{G}|{G\/|\/G\/|\/G}/g);
                var blueMatch = card.text.match(/{U}|{U\/|\/U\/|\/U}/g);
                var redMatch = card.text.match(/{R}|{R\/|\/R\/|\/R}/g);
                var whiteMatch = card.text.match(/{W}|{W\/|\/W\/|\/W}/g);
                var blackMatch = card.text.match(/{B}|{B\/|\/B\/|\/B}/g);

                if (greenMatch) {
                    manaSymbols.green += greenMatch.length * numOfCard;
                }
                if (blueMatch) {
                    manaSymbols.blue += blueMatch.length * numOfCard;
                }
                if (redMatch) {
                    manaSymbols.red += redMatch.length * numOfCard;
                }
                if (whiteMatch) {
                    manaSymbols.white += whiteMatch.length * numOfCard;
                }
                if (blackMatch) {
                    manaSymbols.black += blackMatch.length * numOfCard;
                }
            }

            var greenMatch = card.manaCost.match(/{G}|{G\/|\/G\/|\/G}/g);
            var blueMatch = card.manaCost.match(/{U}|{U\/|\/U\/|\/U}/g);
            var redMatch = card.manaCost.match(/{R}|{R\/|\/R\/|\/R}/g);
            var whiteMatch = card.manaCost.match(/{W}|{W\/|\/W\/|\/W}/g);
            var blackMatch = card.manaCost.match(/{B}|{B\/|\/B\/|\/B}/g);

            if (greenMatch) {
                manaSymbols.green += greenMatch.length * numOfCard;
            }
            if (blueMatch) {
                manaSymbols.blue += blueMatch.length * numOfCard;
            }
            if (redMatch) {
                manaSymbols.red += redMatch.length * numOfCard;
            }
            if (whiteMatch) {
                manaSymbols.white += whiteMatch.length * numOfCard;
            }
            if (blackMatch) {
                manaSymbols.black += blackMatch.length * numOfCard;
            }
        });

        var blueCount = Math.round((manaSymbols.blue / manaSymbols.totalManaSymbols()) * maxLands);
        var whiteCount = Math.round((manaSymbols.white / manaSymbols.totalManaSymbols()) * maxLands);
        var blackCount = Math.round((manaSymbols.black / manaSymbols.totalManaSymbols()) * maxLands);
        var redCount = Math.round((manaSymbols.red / manaSymbols.totalManaSymbols()) * maxLands);
        var greenCount = Math.round((manaSymbols.green / manaSymbols.totalManaSymbols()) * maxLands);

        suggestLands.island = grabLand("island", blueCount);
        suggestLands.plains = grabLand("plains", whiteCount);
        suggestLands.swamp = grabLand("swamp", blackCount);
        suggestLands.mountain = grabLand("mountain", redCount);
        suggestLands.forest = grabLand("forest", greenCount);

        return suggestLands;
    };

    this.filterText = function (searchText, cards) {
        var subtypes = getSubtypes(searchText);
        var cardText = getCardText(searchText);
        var pwrTough = getPowerToughness(searchText);

        searchText = searchText.replace(/\(.*?\)/g, '');

        if (pwrTough) {
            var pwrTghVal = pwrTough[0].split("/");
            var hasPower = pwrTghVal[0] != "x" || pwrTghVal[0] != "X";
            var hasToughness = pwrTghVal[1] != "x" || pwrTghVal[1] != "X";

            cards = cards.filter(function (card) {
                var result = false;

                if (!hasPower && hasToughness) {
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

            if (subtypes) {
                cards = cards.filter(function (card) {
                    var result = false;
                    if (card.subtypes) {
                        subtypes.forEach(function (subtypeSearch) {
                            card.subtypes.forEach(function (subtypeResult) {
                                if (subtypeSearch.toLowerCase() == subtypeResult.toLowerCase()) {
                                    result = true;
                                }
                            });
                        })
                    }
                    return result;
                });
            }

            if (cardText) {
                cards = cards.filter(function (card) {
                    var result = false;
                    if (card.text) {
                        cardText.forEach(function (cardTextSearch) {
                            if (card.text.toLowerCase().includes(cardTextSearch.toLowerCase())) {
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
    };

    function sortByCMC(cards) {
        var sortedArray = cards.sort(function (a, b) {
            return a.cmc - b.cmc;
        });
        return sortedArray;
    }

    function getSubtypes(text) {
        var result = text.match(/\*.*?\*/g);
        if (result) {
            result = result.map(function (el) {
                return el.replace(/^\*|\*$/g, "");
            });
        }
        return result;
    }

    function getCardText(text) {
        var result = text.match(/".*?"/g);
        if (result) {
            result = result.map(function (el) {
                return el.replace(/^"|"$/g, "");
            });
        }
        return result;
    }

    function getPowerToughness(text) {
        var result = text.match(/\(.*?\)/g);
        if (result) {
            result = result.map(function (el) {
                return el.replace(/^\(|\)$/g, '')
            })
        }
        return result;
    }

    function grabLand(landType, amount) {
        var land;
        if (landType == "island") {
            land = ISLAND;
        } else if (landType == "plains") {
            land = PLAINS;
        } else if (landType == "swamp") {
            land = SWAMP;
        } else if (landType == "mountain") {
            land = MOUNTAIN;
        } else if (landType == "forest") {
            land = FOREST;
        }
        var newLand = land;
        newLand.count = amount;
        return newLand;
    }
});