angular.module('app').controller('mainCtrl', function ($scope, $http, deckbuilderService) {
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    $scope.importExample = "2x Aetherworks Marvel\n3x Glimmer of Genius\n20x Plains";

    var maxPage;
    var filteredCards;
    var textCards;
    var textSearchOn = false;
    var textToSearch;
    var currentPage = 1;
    var currentColors = [];
    var currentCMC = [];
    var currentRarities = [];
    var andColors = false;
    var onlyColors = false;
    var params = {
        colors: "",
        cmcs: "",
        colorop: "",
        rarities: "",
        type: "",
        format: "modern"
    };

    var emptyCards = [];

    $scope.formatSelect = "modern";
    $scope.typeFilter = "none";
    $scope.topRow = [];
    $scope.botRow = [];
    $scope.decklist = [];
    $scope.isHover = false;
    $scope.hoverId = "";
    $scope.exportedDeck = "";

    $scope.models = {
        selected: null,
        templates: [
            {type: "card", name: "name", count: 0}
        ],
        dropzones: {
            "deck": [],
        }
    };

    $scope.$watch('models.dropzones', function (model) {
        $scope.decklist = $scope.models.dropzones.deck;
        $scope.displayDeck = reduceArrayP2($scope.decklist);
        var sortedDeck = deckbuilderService.getSortedDisplayDeck($scope.displayDeck);
        var concatSortedArray = (sortedDeck.creature.concat(sortedDeck.spell)).concat(sortedDeck.land);
        $scope.displayDeck = concatSortedArray;
        $scope.isHover = false;
        calcCardsLeft();
        calcTotalCards();
    }, true);

    $scope.clearDeck = function () {
        $scope.models.dropzones.deck = [];
    };

    $scope.getBorder = function (manaCost) {
        if (manaCost) {
            var manaCost = manaCost.replaceAll("{", "").replaceAll("}", "");
            var colors = {
                "U": false,
                "W": false,
                "B": false,
                "R": false,
                "G": false,
            };

            if (manaCost.includes("U")) {
                colors["U"] = true;
            }
            if (manaCost.includes("W")) {
                colors["W"] = true;
            }
            if (manaCost.includes("B")) {
                colors["B"] = true;
            }
            if (manaCost.includes("R")) {
                colors["R"] = true;
            }
            if (manaCost.includes("G")) {
                colors["G"] = true;
            }

            var classString = "";
            if (colors["U"]) {
                classString += "-U";
            }
            if (colors["W"]) {
                classString += "-W";
            }
            if (colors["B"]) {
                classString += "-B";
            }
            if (colors["R"]) {
                classString += "-R";
            }
            if (colors["G"]) {
                classString += "-G";
            }
        }

        return classString + "-border";
    };

    $scope.getManaCost = function (card) {
        var manaCost = [];
        if(card.manaCost){
            manaCost = card.manaCost.replaceAll("{", "").replaceAll("}", "").replace(/[0-9]/g, '').split("");
        }

        var counts = [];
        manaCost.forEach(function (mana) {
            counts.push(mana);
        });
        return counts;
    };

    $scope.getIcon = function (mana) {
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
        }
        return ret;
    };

    $("#back").click(function () {
        pageChange("left")
    });

    $("#forward").click(function () {
        pageChange("right")
    });

    $scope.removeCard = function (card) {
        var deck = $scope.models.dropzones.deck;
        for (var x = 0; x < deck.length; x++) {
            var deckCard = deck[x];
            if (deckCard.name == card.name) {
                $scope.models.dropzones.deck.splice(x, 1);
                break;
            }
        }
    };

    $scope.addCard = function (card) {
        $scope.models.dropzones.deck.push(card);
    };

    $scope.searchText = function (text) {
        textToSearch = text;
        filterText(textToSearch);
    };

    $scope.formatChange = function (format) {
        params.format = format;
        resetPage();
    };

    $scope.typeChange = function (type) {
        params.type = type;
        resetPage();
    };

    $scope.exportDeck = function () {
        $scope.exportedDeck = [];
        var displayDeck = $scope.displayDeck;
        if ($scope.displayDeck.length >= 1) {
            for (var i = 0; i < displayDeck.length; i++) {
                $scope.exportedDeck += (displayDeck[i].count + "x");
                $scope.exportedDeck += (" " + displayDeck[i].name + "\n");
            }
        }
        else {
            $scope.exportedDeck = "No cards in deck."
        }
        console.log(deckbuilderService.suggestBasicLands($scope.displayDeck, 20));
        console.log(deckbuilderService.getManaSymbolCount($scope.displayDeck));
        console.log(deckbuilderService.getManaCurve($scope.displayDeck));
    };

    $scope.importDeck = function (importedString, willOverride) {
        $http({
            method: 'GET',
            url: '/api/buildImport?importedString=' + importedString
        }).then(function responseCallback(response) {
            if (willOverride) {
                $scope.models.dropzones.deck = response.data;

            } else {
                $scope.models.dropzones.deck = $scope.models.dropzones.deck.concat(response.data);
            }

        }, function errorCallback(response) {
            console.error(response.data);
        });

    };

    $scope.getCardsLeft = function (card) {
        var count = 0;
        var displayDeck = $scope.displayDeck;
        if (displayDeck.length > 1) {
            displayDeck.forEach(function (displayCard) {
                if (displayCard.name == card.name) {
                    count = displayCard.count;
                }
            })
        }
        return 4 - count;
    };

    /*
     RARITY FILTERS
     */
    $("#common").change(function (event) {
        rarityChange("Common", event);
        rarityFilter();
    });

    $("#uncommon").change(function (event) {
        rarityChange("Uncommon", event);
        rarityFilter();
    });

    $("#rare").change(function (event) {
        rarityChange("Rare", event);
        rarityFilter();
    });

    $("#mythic").change(function (event) {
        rarityChange("Mythic Rare", event);
        rarityFilter();
    });

    function rarityChange(rarity, event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            currentRarities.push(rarity);
        } else {
            var index = currentRarities.indexOf(rarity);
            currentRarities.splice(index, 1);
        }
    }

    /*
     COLOR FILTERS
     */
    $("#c").change(function (event) {
        colorChange("C", event);
        colorFilter();
    });

    $("#b").change(function (event) {
        colorChange("B", event);
        colorFilter();
    });

    $("#w").change(function (event) {
        colorChange("W", event);
        colorFilter();
    });

    $("#u").change(function (event) {
        colorChange("U", event);
        colorFilter();
    });

    $("#r").change(function (event) {
        colorChange("R", event);
        colorFilter();
    });

    $("#g").change(function (event) {
        colorChange("G", event);
        colorFilter();
    });

    $("#and").change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            if (params.colorop == "only") {
                params.colorop = "and,only";
            } else {
                params.colorop = "and";
            }
        } else {
            if (params.colorop == "and,only") {
                params.colorop = "only";
            } else {
                params.colorop = "";
            }
        }
        colorFilter();
    });

    $("#only").change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            if (params.colorop == "and") {
                params.colorop = "and,only";
            } else {
                params.colorop = "only";
            }
        } else {
            if (params.colorop == "and,only") {
                params.colorop = "and";
            } else {
                params.colorop = "";
            }
        }
        colorFilter();
    });

    function colorChange(color, event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            currentColors.push(color);
        } else {
            var index = currentColors.indexOf(color);
            currentColors.splice(index, 1);
        }
    }

    /*
     CMC FILTERS
     */
    $("#cmcZero").change(function (event) {
        CMCChange("0", event);
        cmcFilter();
    });

    $("#cmcOne").change(function (event) {
        CMCChange("1", event);
        cmcFilter();
    });

    $("#cmcTwo").change(function (event) {
        CMCChange("2", event);
        cmcFilter();
    });

    $("#cmcThree").change(function (event) {
        CMCChange("3", event);
        cmcFilter();
    });

    $("#cmcFour").change(function (event) {
        CMCChange("4", event);
        cmcFilter();
    });

    $("#cmcFive").change(function (event) {
        CMCChange("5", event);
        cmcFilter();
    });

    $("#cmcSix").change(function (event) {
        CMCChange("6", event);
        cmcFilter();
    });

    $("#cmcSeven").change(function (event) {
        CMCChange("7", event);
        cmcFilter();
    });

    $("#cmcEightPlus").change(function (event) {
        CMCChange("8", event);
        cmcFilter();
    });

    $scope.dragStart = function () {
        $('#drag-box').removeClass("drag-box").addClass("drag-box-ondrag");
    };

    $scope.dragEnd = function () {
        $('#drag-box').removeClass("drag-box-ondrag").addClass("drag-box");
    };

    function CMCChange(number, event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            currentCMC.push(number);
        } else {
            var index = currentCMC.indexOf(number);
            currentCMC.splice(index, 1);
        }
    }

    function colorFilter() {
        params.colors = currentColors.join(",");
        resetPage();
    }

    function cmcFilter() {
        params.cmcs = currentCMC.join(",");
        resetPage();
    }

    function rarityFilter() {
        params.rarities = currentRarities.join(",");
        resetPage();
    }

    function resetPage() {
        currentPage = 1;
        filterCards();
    }

    function pageChange(direction) {
        if (direction) {
            if (direction == "left") {
                if (currentPage > 1) {
                    currentPage--;
                }
            } else {
                currentPage++;
            }
            if (textSearchOn) {
                paginate(currentPage, textCards)
            } else {
                paginate(currentPage, filteredCards)
            }

        } else {
            paginate(currentPage, filteredCards)
        }
    }

    function calcCardsLeft() {
        var displayDeck = $scope.displayDeck;
        var topRow = $scope.topRow;
        var botRow = $scope.botRow;

        var updatedCards = deckbuilderService.getCardsLeft(displayDeck, topRow, botRow);
        $scope.topRow = updatedCards.topUpdate;
        $scope.botRow = updatedCards.botUpdate;
    }

    function calcTotalCards() {
        $scope.totalDisplayCards = deckbuilderService.getTotalCardCount($scope.displayDeck);
    }

    function filterCards() {
        $scope.topRow = [{loading: true}, {loading: true}, {loading: true}, {loading: true}];
        $scope.botRow = [{loading: true}, {loading: true}, {loading: true}, {loading: true}];
        deckbuilderService.getCards(params).then(function (cards) {
            filteredCards = cards;
            var totalPages = filteredCards.length / 8;
            var minPages = Math.floor(filteredCards.length / 8);

            if (totalPages - minPages > 0) {
                maxPage = minPages + 1;
            } else {
                maxPage = minPages;
            }

            if (textSearchOn) {
                filterText(textToSearch);
            } else {
                paginate(currentPage, filteredCards);
            }
        });
    }

    function populateCardView(cards) {

        for (var x = 0; x < 8; x++) {
            var index = x;
            var card = cards[index];

            if (x < 4) {
                if (card) {
                    card.empty = false;
                    $scope.topRow[index] = card;
                } else {
                    $scope.topRow[index] = {empty: true};
                }
            } else {
                if (card) {
                    card.empty = false;
                    $scope.botRow[index - 4] = card;
                } else {
                    $scope.botRow[index - 4] = {empty: true}
                }
            }
        }
        $scope.$apply();
    }

    function paginate(page, cards) {
        var newCards = [];
        if (page > 0) {
            var indexStart = (page * 8) - 8;
            for (var x = indexStart; x < indexStart + 8; x++) {
                if (objectValues(cards)[x]) {
                    newCards.push(objectValues(cards)[x]);
                }
            }
        } else {
            for (var x = 0; x < 8; x++) {
                if (objectValues(cards)[x]) {
                    newCards.push(objectValues(cards)[x]);
                }
            }
        }
        validatePageChange();
        populateCardView(newCards);
    }

    function validatePageChange() {
        if (currentPage < 2) {
            $("#back").css("display", "none");
        } else {
            $("#back").css("display", "inherit");
        }
        if (currentPage >= maxPage) {
            $("#forward").css("display", "none");
        } else {
            $("#forward").css("display", "inherit");
        }
    }

    function filterText(text) {
        if (text.length > 0) {
            textSearchOn = true;
            textCards = deckbuilderService.filterText(text, filteredCards);
            var totalPages = textCards.length / 8;
            var minPages = Math.floor(textCards.length / 8);

            if (totalPages - minPages > 0) {
                maxPage = minPages + 1;
            } else {
                maxPage = minPages;
            }

            currentPage = 1;
            paginate(currentPage, textCards);
        } else {
            textSearchOn = false;
            resetPage();
        }
    }

    $scope.showHover = function (multiverseid) {
        $scope.isHover = true;
        $scope.hoverId = multiverseid;
    };

    $scope.hideHover = function () {
        $scope.isHover = false;
        $scope.hoverId = "";
    };

    filterCards();
});