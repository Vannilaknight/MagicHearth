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
    };

    this.getManaCurve = function (displayCards) {
        var manaCurve = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        displayCards.forEach(function (card) {
            if(card.hasOwnProperty("cmc")) {
                var numOfCard = displayCards[displayCards.indexOf(card)].count;
                if(card.cmc < 8) {

                    manaCurve[card.cmc] += numOfCard;
                } else {
                    manaCurve[8] += numOfCard;
                }
            }
        })
        return manaCurve;
    };

    this.suggestBasicLands = function(displayCards, maxLands) {
        var suggestLands = {
            "Island": ISLAND,
            "Plains": PLAINS,
            "Swamp": SWAMP,
            "Mountain": MOUNTAIN,
            "Forest": FOREST,
        };

        var manaSymbols = this.getManaSymbolCount(displayCards);
        var totalSymbolCount = manaSymbols.totalManaSymbols();

        suggestLands.Island.count = checkLandCount(manaSymbols.blue, totalSymbolCount, maxLands);
        suggestLands.Plains.count = checkLandCount(manaSymbols.white, totalSymbolCount, maxLands);
        suggestLands.Swamp.count = checkLandCount(manaSymbols.black, totalSymbolCount, maxLands);
        suggestLands.Mountain.count = checkLandCount(manaSymbols.red, totalSymbolCount, maxLands);
        suggestLands.Forest.count = checkLandCount(manaSymbols.green, totalSymbolCount, maxLands);

        var numOfLandsLeft = maxLands - (suggestLands.Island.count   +
                                         suggestLands.Swamp.count    +
                                         suggestLands.Mountain.count +
                                         suggestLands.Forest.count   +
                                         suggestLands.Plains.count);

        if(numOfLandsLeft > 0) {
            suggestLands = increaseLowest(suggestLands, numOfLandsLeft);

        } else if (numOfLandsLeft < 0) {
            suggestLands = decreaseHighest(suggestLands, Math.abs(numOfLandsLeft));
        }

        return suggestLands;
    };

    this.getManaSymbolCount = function (displayCards){
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
            },
        };

        displayCards.forEach(function(card) {
            var numOfCard = displayCards[displayCards.indexOf(card)].count;
            if(card.hasOwnProperty("manaCost")){
                manaSymbols = countManaSymbols(card.manaCost, manaSymbols, numOfCard);
            }
            if(card.hasOwnProperty("text")) {
                manaSymbols = countManaSymbols(card.text, manaSymbols, numOfCard);
            }
        });

        return manaSymbols;
    };

    this.filterText = function (searchText, cards){
        var splitText = /@/g;

        if(searchText.match(splitText)) {
            var searchBy = searchText.split('@');
            cards = this.filterText(searchBy[0], cards);
            if(searchBy[1]) {
                var regex = /(\(((\d|[x!X])\/(\d|[x|X]))\))/g
                if(searchBy[1].match(regex)) {
                    cards = this.filterText(searchBy[1], cards);
                }
            }
            return cards;
        }

        var subtypes = getSubtypes(searchText);
        var cardText = getCardText(searchText);
        var pwrTough = getPowerToughness(searchText);

        if(pwrTough) {
            cards = checkPowerToughness(pwrTough, cards);
        } else {
            var check = true;
            if(subtypes){
                cards = checkSubTypes(subtypes, cards);
                check = false;
            }
            if(cardText){
                cards = checkCardText(cardText, cards);
                check = false;
            }

            if(check) {
                cards = checkAll(searchText, cards);
            }
        }

        return cards;
    };

    this.getRandomPrice = function () {
      return randomPrecise(0, 100, 2);
    };

    function checkLandCount(symbolCount, totalSymbols, maxLands) {
        var floorCount = (symbolCount / totalSymbols) * maxLands;

        if(floorCount < 1 && floorCount > 0) {
            floorCount = 1;
        }
        return Math.floor(floorCount);
    }

    function countManaSymbols (cardText, manaSymbols, numOfCard) {
        var ignoreRegex = /{2\/\w}/g;
        var tapRegex = /{T}/g;

        if(!(ignoreRegex.test(cardText))) {
            if(tapRegex.test(cardText)) {
                var splitCardText = cardText.split("\n");
                if(splitCardText.length > 1) {
                    splitCardText.forEach(function (string) {
                        var secondSplit = string.split("{T}");
                        if(secondSplit.length > 1) {
                            manaSymbols = countManaSymbols(string[0], manaSymbols, numOfCard);
                        }
                    })
                }
            }
            var greenMatch = cardText.match(/{G}|{G\/|\/G\/|\/G}/g);
            var blueMatch = cardText.match(/{U}|{U\/|\/U\/|\/U}/g);
            var redMatch = cardText.match(/{R}|{R\/|\/R\/|\/R}/g);
            var whiteMatch = cardText.match(/{W}|{W\/|\/W\/|\/W}/g);
            var blackMatch = cardText.match(/{B}|{B\/|\/B\/|\/B}/g);

            if(greenMatch) {
                manaSymbols.green += greenMatch.length * numOfCard;
            }
            if(blueMatch) {
                manaSymbols.blue += blueMatch.length * numOfCard;
            }
            if(redMatch) {
                manaSymbols.red += redMatch.length * numOfCard;
            }
            if(whiteMatch) {
                manaSymbols.white += whiteMatch.length * numOfCard;
            }
            if(blackMatch) {
                manaSymbols.black += blackMatch.length * numOfCard;
            }
        }

        return manaSymbols;
    }

    function decreaseHighest(landSuggestion, remainder) {
        for(var i = 0; i < remainder; i++) {
            var land;
            var red = landSuggestion["Mountain"].count;
            var blue = landSuggestion["Island"].count;
            var white = landSuggestion["Plains"].count;
            var green = landSuggestion["Forest"].count;
            var black = landSuggestion["Swamp"].count;

            if(red > 0) {
                land = landSuggestion["Mountain"];
            }
            if(black > 0) {
                land = landSuggestion["Swamp"];
            }
            if(white > 0) {
                land = landSuggestion["Plains"];
            }
            if(blue > 0) {
                land = landSuggestion["Island"];
            }
            if(green > 0) {
                land = landSuggestion["Forest"];
            }

            if(blue > land.count && blue > 0) land = landSuggestion["Island"];
            if(white > land.count && white > 0) land = landSuggestion["Plains"];
            if(black > land.count && black > 0) land = landSuggestion["Swamp"];
            if(red > land.count && red > 0) land = landSuggestion["Mountain"];
            if(green > land.count && green > 0) land = landSuggestion["Forest"];
            landSuggestion[land.name].count -= 1;
        }
        return landSuggestion;
    }

    function increaseLowest(landSuggestion, remainder) {

        for(var i = 0; i < remainder; i++) {
            var land;
            var red = landSuggestion["Mountain"].count;
            var blue = landSuggestion["Island"].count;
            var white = landSuggestion["Plains"].count;
            var green = landSuggestion["Forest"].count;
            var black = landSuggestion["Swamp"].count;

            if(red > 0) {
                land = landSuggestion["Mountain"];
            }
            if(black > 0) {
                land = landSuggestion["Swamp"];
            }
            if(white > 0) {
                land = landSuggestion["Plains"];
            }
            if(blue > 0) {
                land = landSuggestion["Island"];
            }
            if(green > 0) {
                land = landSuggestion["Forest"];
            }

            if(blue < land.count && blue > 0) land = landSuggestion["Island"];
            if(white < land.count && white > 0) land = landSuggestion["Plains"];
            if(black < land.count && black > 0) land = landSuggestion["Swamp"];;
            if(red < land.count && red > 0) land = landSuggestion["Mountain"];
            if(green < land.count && green > 0) land = landSuggestion["Forest"];

            landSuggestion[land.name].count += 1;

        }
        return landSuggestion;
    }

    function checkAll(searchText, cards) {
        searchText = searchText.replace('*', '');
        searchText = searchText.replace('"', '');
        searchText = searchText.replace('(', '').replace(')', '');
        searchText = searchText.trim();

        cards = cards.filter(function(card) {
            var result = false;
            if(card.name.toLowerCase().match(searchText.toLowerCase())) {
                return true;
            }

            if (card.hasOwnProperty("text")) {
                if(card.text.toLowerCase().match(searchText.toLowerCase())) {
                    return true;
                }
            }
            if (card.hasOwnProperty("subtypes")){
                card.subtypes.forEach(function (type) {
                    if(type.toLowerCase() == searchText.toLowerCase()) {
                        result = true;
                    }

                })
            }
            return result;
        })
        return cards;
    }

    function checkPowerToughness(text, cards) {
        var pwrTghVal = text[0].split("/");
        var hasPower = pwrTghVal[0].toLowerCase() != "x";
        var hasToughness = pwrTghVal[1].toLowerCase() != "x";

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
        return cards;
    }

    function checkSubTypes(subtypes, cards) {
        cards = cards.filter(function (card) {
            var result = false;
            if(card.hasOwnProperty("subtypes")) {
                if(card.subtypes){
                    subtypes.forEach(function (subtypeSearch) {
                        card.subtypes.forEach(function (subtypeResult) {
                            if(subtypeSearch.toLowerCase() == subtypeResult.toLowerCase()){
                                result = true;
                            }
                        });
                    })
                }
            }

            return result;
        });

        return cards;
    }

    function checkCardText(cardText, cards) {
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
        return cards;
    }

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