function getSortedDisplayDeck(displayCards) {
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
    if(creatures.length > 0) {
        creatures = sortCards(creatures);
    }
    if(spells.length > 0) {
        spells = sortCards(spells);
    }


    return {
        creature: creatures,
        spell: spells,
        land: lands
    };
}

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
            return manaSymbolExclusion(cardText, manaSymbols, numOfCard);
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

function manaSymbolExclusion(cardText, manaSymbols, numOfCard) {
    var splitCardText = cardText.split("\n");
    splitCardText.forEach(function (line) {
        var splitOnTap = line.split("{T}");
        var ignoreRegex = /\(/g
        if(ignoreRegex.test(splitOnTap[0])) {
            manaSymbols = countManaSymbols(splitOnTap[0].split('(')[0], manaSymbols, numOfCard);
        }
        else {
            manaSymbols = countManaSymbols(splitOnTap.toString(), manaSymbols, numOfCard);
        }
    })
    return manaSymbols;

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

function sortCards(cards) {
    var allCMCs = [];
    var result = [];
    var highestCMC = 0;
    //Find Highest CMC
    cards.forEach(function (card) {
        if(card.cmc > highestCMC) {
            highestCMC = parseInt(card.cmc);
        }
    })
    //Initialize array
    for(var i = 0; i <= highestCMC; i++) {
        allCMCs[i] = [];
    }
    // Add cards to appropriate index in allCMCs

    cards.forEach(function (card) {
        if(card.hasOwnProperty("cmc")) {
            allCMCs[parseInt(card.cmc)].push(card);
        }
    })
    //Add each array of cards to result;

    allCMCs.forEach(function(cmc) {
        if(cmc.length > 0) {
            var sortedCards = sortByName(cmc);
            result = result.concat(sortedCards);
        }
    })

    return result;
}

function sortByCMC(cards) {
    var sortedArray = cards.sort(function (a, b) {
        return a.cmc - b.cmc;
    });
    return sortedArray;
}

function sortByName(cards) {
    return cards.sort(function (a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
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

function countCards(cards){
    var total = 0;
    cards.forEach(function (card) {
        total += card.count;
    });
    return total;
}