angular.module('app').service('deckService', function () {
    this.decklist = [];
    this.displayDeck = [];
    this.creatureDeck = [];
    this.spellDeck = [];
    this.landDeck = [];
    this.isHover = false;

    this.updateDeck = function (deck) {
        this.decklist = deck;
        this.displayDeck = reduceArrayP2(this.decklist);
        var sortedDeck = getSortedDisplayDeck(this.displayDeck);
        this.displayDeck = (sortedDeck.creature.concat(sortedDeck.spell)).concat(sortedDeck.land);
        this.creatureDeck = sortedDeck.creature;
        this.spellDeck = sortedDeck.spell;
        this.landDeck = sortedDeck.land;
        this.isHover = false;
    };

    this.getDeckDisplay = function () {
        return {
            creatureDeck: this.creatureDeck,
            spellDeck: this.spellDeck,
            landDeck: this.landDeck
        }
    };

    this.getTotalCardCount = function () {
        return {
            total: countCards(this.displayDeck),
            creature: countCards(this.creatureDeck),
            spell: countCards(this.spellDeck),
            land: countCards(this.landDeck)
        }
    };

    this.getManaCurve = function () {
        var displayCards = this.displayDeck;
        var manaCurve = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        displayCards.forEach(function (card) {
            if (card.hasOwnProperty("cmc")) {
                var numOfCard = displayCards[displayCards.indexOf(card)].count;
                if (card.cmc < 8) {

                    manaCurve[card.cmc] += numOfCard;
                } else {
                    manaCurve[8] += numOfCard;
                }
            }
        })
        return manaCurve;
    };

    this.suggestBasicLands = function () {
        var displayCards = this.displayDeck;
        var maxLands = 60 - this.getTotalCardCount().total;
        console.log(maxLands);
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

        var numOfLandsLeft = maxLands - (suggestLands.Island.count +
            suggestLands.Swamp.count +
            suggestLands.Mountain.count +
            suggestLands.Forest.count +
            suggestLands.Plains.count);

        if (numOfLandsLeft > 0) {
            suggestLands = increaseLowest(suggestLands, numOfLandsLeft);

        } else if (numOfLandsLeft < 0) {
            suggestLands = decreaseHighest(suggestLands, Math.abs(numOfLandsLeft));
        }

        return suggestLands;
    };

    this.getManaSymbolCount = function () {
        var displayCards = this.displayDeck;
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
        displayCards.forEach(function (card) {
            var numOfCard = displayCards[displayCards.indexOf(card)].count;
            if (card.hasOwnProperty("manaCost")) {
                manaSymbols = countManaSymbols(card.manaCost, manaSymbols, numOfCard);
            }
            if (card.hasOwnProperty("text")) {
                manaSymbols = countManaSymbols(card.text, manaSymbols, numOfCard);
            }
        });

        return manaSymbols;
    };

    this.filterText = function (searchText, cards) {
        var splitText = /@/g;

        if (searchText.match(splitText)) {
            var searchBy = searchText.split('@');
            cards = this.filterText(searchBy[0], cards);
            if (searchBy[1]) {
                var regex = /(\(((\d|[x!X])\/(\d|[x|X]))\))/g
                if (searchBy[1].match(regex)) {
                    cards = this.filterText(searchBy[1], cards);
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

        console.log(cards)
        return cards;
    };

    this.buildBorder = function (manaCost) {
        if (manaCost) {
            var manaCost = manaCost.replaceAll("{", "").replaceAll("}", "");
            var colors = {
                "U": false,
                "W": false,
                "B": false,
                "R": false,
                "G": false,
            };

            if (manaCost.includes("U")) colors["U"] = true;
            if (manaCost.includes("W")) colors["W"] = true;
            if (manaCost.includes("B")) colors["B"] = true;
            if (manaCost.includes("R")) colors["R"] = true;
            if (manaCost.includes("G")) colors["G"] = true;

            var classString = "";
            if (colors["U"]) classString += "-U";
            if (colors["W"]) classString += "-W";
            if (colors["B"]) classString += "-B";
            if (colors["R"]) classString += "-R";
            if (colors["G"]) classString += "-G";
        }

        return classString + "-border";
    };

    this.buildCMCicon = function (mana) {
        var ret = "";
        if (mana == "U") {
            ret = "icon-bluesvg";
        } else if (mana == "W") {
            ret = "icon-whitesvg";
        } else if (mana == "B") {
            ret = "icon-blacksvg";
        } else if (mana == "R") {
            ret = "icon-redsvg";
        } else if (mana == "G") {
            ret = "icon-greensvg";
        } else {
            ret = "icon-" + mana;
        }
        return ret;
    };
});