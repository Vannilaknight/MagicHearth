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
    };
    this.suggestBasicLands = function(displayCards, maxLands) {
        var suggestLands = {};
        var numOfLandsLeft = maxLands;
        var basicLands = [
            {
                "artist": "Noah Bradley",
                "colorIdentity": [
                    "B"
                ],
                "id": "fbb9e2dc5502112629568360971e9ce30653ba0d",
                "imageName": "swamp1",
                "layout": "normal",
                "mciNumber": "260a",
                "multiverseid": 402055,
                "name": "Swamp",
                "number": "260",
                "rarity": "Basic Land",
                "subtypes": [
                    "Swamp"
                ],
                "supertypes": [
                    "Basic"
                ],
                "type": "Basic Land — Swamp",
                "types": [
                    "Land"
                ],
                "variations": [
                    402053,
                    402054,
                    402056,
                    402057,
                    402058,
                    402059,
                    402060,
                    402061,
                    402062
                ]
            },
            {
                "artist": "Noah Bradley",
                "colorIdentity": [
                    "G"
                ],
                "id": "548962371ba9874ebb0dced6970da7c987e1adf8",
                "imageName": "forest6",
                "layout": "normal",
                "mciNumber": "270b",
                "multiverseid": 401887,
                "name": "Forest",
                "number": "270",
                "rarity": "Basic Land",
                "subtypes": [
                    "Forest"
                ],
                "supertypes": [
                    "Basic"
                ],
                "type": "Basic Land — Forest",
                "types": [
                    "Land"
                ],
                "variations": [
                    401882,
                    401883,
                    401884,
                    401885,
                    401886,
                    401888,
                    401889,
                    401890,
                    401891
                ]
            },
            {
                "artist": "Jonas De Ro",
                "colorIdentity": [
                    "R"
                ],
                "id": "412adb3be5e9728a55411a886acc2f95711e1ee4",
                "imageName": "mountain1",
                "layout": "normal",
                "multiverseid": 410061,
                "name": "Mountain",
                "number": "292",
                "rarity": "Basic Land",
                "subtypes": [
                    "Mountain"
                ],
                "supertypes": [
                    "Basic"
                ],
                "type": "Basic Land — Mountain",
                "types": [
                    "Land"
                ],
                "variations": [
                    410062,
                    410063
                ]
            },
            {
                "artist": "Jonas De Ro",
                "colorIdentity": [
                    "U"
                ],
                "id": "e23f89116bf02b88d6e68b57b816c2cbec200866",
                "imageName": "island1",
                "layout": "normal",
                "multiverseid": 410055,
                "name": "Island",
                "number": "286",
                "rarity": "Basic Land",
                "subtypes": [
                    "Island"
                ],
                "supertypes": [
                    "Basic"
                ],
                "type": "Basic Land — Island",
                "types": [
                    "Land"
                ],
                "variations": [
                    410056,
                    410057
                ]
            },
            {
                "artist": "Noah Bradley",
                "colorIdentity": [
                    "W"
                ],
                "id": "db17ba1d9144fc8b6cc3f2ef4ed963920f66a923",
                "imageName": "plains1",
                "layout": "normal",
                "mciNumber": "250a",
                "multiverseid": 401985,
                "name": "Plains",
                "number": "250",
                "rarity": "Basic Land",
                "subtypes": [
                    "Plains"
                ],
                "supertypes": [
                    "Basic"
                ],
                "type": "Basic Land — Plains",
                "types": [
                    "Land"
                ],
                "variations": [
                    401986,
                    401987,
                    401988,
                    401989,
                    401990,
                    401991,
                    401992,
                    401993,
                    401994
                ]
            }
        ]
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
        }

        displayCards.forEach(function(card) {
            console.log(card.manaCost);
            var numOfCard = displayCards[displayCards.indexOf(card)].count;

            if(card.text) {
                var greenMatch = card.text.match(/{G}|{G\/|\/G\/|\/G}/g);
                var blueMatch = card.text.match(/{U}|{U\/|\/U\/|\/U}/g);
                var redMatch = card.text.match(/{R}|{R\/|\/R\/|\/R}/g);
                var whiteMatch = card.text.match(/{W}|{W\/|\/W\/|\/W}/g);
                var blackMatch = card.text.match(/{B}|{B\/|\/B\/|\/B}/g);

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
                //manaSymbols.colorless += card.text.match(/{\d}/g).length;
            }
            var greenMatch = card.manaCost.match(/{G}|{G\/|\/G\/|\/G}/g);
            var blueMatch = card.manaCost.match(/{U}|{U\/|\/U\/|\/U}/g);
            var redMatch = card.manaCost.match(/{R}|{R\/|\/R\/|\/R}/g);
            var whiteMatch = card.manaCost.match(/{W}|{W\/|\/W\/|\/W}/g);
            var blackMatch = card.manaCost.match(/{B}|{B\/|\/B\/|\/B}/g);

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

            //manaSymbols.colorless += card.manaCost.match(/{\d}/g).length;
        })

        basicLands.forEach(function (land) {
            var numOfLand = 0;
            if(land.name == "Mountain") {
                numOfLand = (manaSymbols.red / manaSymbols.totalManaSymbols()) * maxLands;

                console.log((manaSymbols.red / manaSymbols.totalManaSymbols()) * 100);
            } else if (land.name == "Island") {
                numOfLand = (manaSymbols.blue / manaSymbols.totalManaSymbols()) * maxLands;
                console.log((manaSymbols.blue / manaSymbols.totalManaSymbols()) * 100);
            } else if (land.name == "Plains") {
                numOfLand = (manaSymbols.white / manaSymbols.totalManaSymbols()) * maxLands;
                console.log((manaSymbols.white / manaSymbols.totalManaSymbols()) * 100);
            } else if (land.name == "Swamp") {
                numOfLand = (manaSymbols.black / manaSymbols.totalManaSymbols()) * maxLands;
                console.log((manaSymbols.black / manaSymbols.totalManaSymbols()) * 100);
            } else if (land.name == "Forest") {
                numOfLand = (manaSymbols.green / manaSymbols.totalManaSymbols()) * maxLands;
                console.log((manaSymbols.green / manaSymbols.totalManaSymbols()) * 100);
            }

            numOfLand = Math.round(numOfLand);
            numOfLandsLeft -= numOfLand;

            console.log(numOfLand);

            suggestLands.hasOwnProperty(land.name);
            suggestLands[land.name] = land;

            suggestLands[land.name].count = numOfLand;

        })


        return suggestLands;
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