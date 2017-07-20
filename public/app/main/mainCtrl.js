angular.module('app').controller('mainCtrl', function ($scope, $http, $window, $cookies, deckService, cardService, exportImportService, paginateService) {
    $scope.importExample = "2x Aetherworks Marvel\n3x Glimmer of Genius\n20x Plains";

    var currentColors = [];
    var currentCMC = [];
    var currentRarities = [];
    var hideDupes = false;
    var hideBanned = false;


    $scope.formatSelect = "modern";
    $scope.typeFilter = "none";
    $scope.topRow = [];
    $scope.botRow = [];
    $scope.decklist = [];
    $scope.isHover = false;
    $scope.hoverId = "";
    $scope.exportedDeck = "";
    $scope.exportFile;

    $scope.sIsland = 0;
    $scope.sPlains = 0;
    $scope.sSwamp = 0;
    $scope.sMountain = 0;
    $scope.sForest = 0;

    $scope.totalCreatureCards = 0;
    $scope.totalSpellCards = 0;
    $scope.totalLandCards = 0;

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
        deckService.updateDeck(model.deck);
        applyCardsLeft();
        calcTotalCards();
        var display = deckService.getDeckDisplay();
        $scope.creatureDeck = display.creatureDeck;
        $scope.spellDeck = display.spellDeck;
        $scope.landDeck = display.landDeck;
    }, true);

    $scope.clearDeck = function () {
        $scope.models.dropzones.deck = [];
    };

    $scope.getBorder = function (manaCost) {
        return deckService.buildBorder(manaCost);
    };

    $scope.getManaCost = function (card) {
        var manaCost = [];
        if (card.manaCost) {
            manaCost = card.manaCost.replaceAll("{", "").replaceAll("}", "").split("");
        }

        return manaCost;
    };

    $scope.getIcon = function (mana) {
        return deckService.buildCMCicon(mana);
    };

    $("#back").click(function () {
        pageChange("left");
    });

    $("#forward").click(function () {
        pageChange("right");
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
        console.log(card);
        if (card.cardsLeft) {
            if (card.cardsLeft > 0) {
                $scope.models.dropzones.deck.push(card);
            }
        } else {
            $scope.models.dropzones.deck.push(card);
        }

    };

    $scope.searchText = function (text) {
        cardService.setTextToSearch(text);
        cardService.filterText();
        updatePage();
    };

    $scope.formatChange = function (format) {
        cardService.setParam("format", format);
        resetPage();
    };

    $scope.typeChange = function (type) {
        cardService.setParam("type", type);
        resetPage();
    };

    $scope.suggestLand = function () {
        var suggestedLand = deckService.suggestBasicLands();
        $scope.sIsland = suggestedLand.Island.count || 0;
        $scope.sPlains = suggestedLand.Plains.count || 0;
        $scope.sSwamp = suggestedLand.Swamp.count || 0;
        $scope.sMountain = suggestedLand.Mountain.count || 0;
        $scope.sForest = suggestedLand.Forest.count || 0;
    };

    $scope.countMana = function (color, direction) {
        switch (color) {
            case 'u':
                if(direction == "+")
                    $scope.sIsland++;
                else
                    if($scope.sIsland > 0)
                        $scope.sIsland--;
                break;
            case 'w':
                if(direction == "+")
                    $scope.sPlains++;
                else
                    if($scope.sPlains > 0)
                        $scope.sPlains--;
                break;
            case 'b':
                if(direction == "+")
                    $scope.sSwamp++;
                else
                    if($scope.sSwamp > 0)
                        $scope.sSwamp--;
                break;
            case 'r':
                if(direction == "+")
                    $scope.sMountain++;
                else
                    if($scope.sMountain > 0)
                        $scope.sMountain--;
                break;
            case 'g':
                if(direction == "+")
                    $scope.sForest++;
                else
                    if($scope.sForest > 0)
                        $scope.sForest--;
                break;
        }
    };

    $scope.applyLands = function (u, w, b, r, g) {
        var lands = [{land:"u", count:u}, {land:"w", count:w}, {land:"b", count:b}, {land:"r", count:r}, {land:"g", count:g}];
        lands.forEach(function (land) {
           if(land.count > 0){
               var deck = $scope.models.dropzones.deck;
               $scope.models.dropzones.deck = deck.concat(createLand(land.land, land.count));
           }
        });
    };

    $scope.prepareStats = function () {
        var symbols = deckService.getManaSymbolCount();
        var symbolsCount = [symbols.blue, symbols.white,symbols.black,symbols.red,symbols.green];
      createChart(deckService.getManaCurve(), symbolsCount);
    };

    $scope.exportDeck = function () {
        $scope.exportedDeck = "";
        var displayDeck = deckService.displayDeck;
        if (displayDeck.length >= 1) {
            for (var i = 0; i < displayDeck.length; i++) {
                $scope.exportedDeck += (displayDeck[i].count + "x");
                $scope.exportedDeck += (" " + displayDeck[i].name);
                $scope.exportedDeck += "\r\n";
            }
            $scope.exportFile = exportImportService.createExportFile($window, $scope.exportedDeck);
        }
        else {
            $scope.exportedDeck = "No cards in deck."
        }
    };

    $scope.importDeck = function (importedString, willOverride) {
        exportImportService.import(importedString).then(function (imported) {
            if (willOverride) {
                $scope.models.dropzones.deck = imported;
            } else {
                $scope.models.dropzones.deck = $scope.models.dropzones.deck.concat(imported);
            }
        });
    };

    /*
     SETTINGS
     */
    $("#banned").change(function (event) {
        hideBanned = !hideBanned;
        $cookies.put('bannedSelection', hideBanned);
        filterCards();
    });

    $("#duplicates").change(function (event) {
        hideDupes = !hideDupes;
        $cookies.put('duplicateSelection', hideDupes);
        filterCards();
    });

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
        cardService.setParam("colors", currentColors.join(","));
        resetPage();
    }

    function cmcFilter() {
        cardService.setParam("cmcs", currentCMC.join(","));
        resetPage();
    }

    function rarityFilter() {
        cardService.setParam("rarities", currentRarities.join(","));
        resetPage();
    }

    function resetPage() {
        paginateService.setPage(1);
        filterCards();
    }

    function createLand(color, count) {
        var lands = [];
        var land;
        if (color == "u") {
            land = ISLAND;
        } else if (color == "w") {
            land = PLAINS;
        } else if (color == "b") {
            land = SWAMP;
        } else if (color == "r") {
            land = MOUNTAIN;
        } else if (color == "g") {
            land = FOREST;
        }

        for(var x = 0; x < count; x++){
            lands.push(land);
        }
        return lands;
    }

    function pageChange(direction) {
        if (direction) {
            if (direction == "left") {
                if (paginateService.currentPage > 1) {
                    paginateService.setPage("-");
                }
            } else {
                paginateService.setPage("+");
            }
            cardService.changePage();
            updatePage();
        }
    }

    function calcTotalCards() {
        var counts = deckService.getTotalCardCount();
        $scope.totalDisplayCards = counts.total;
        $scope.totalCreatureCards = counts.creature;
        $scope.totalSpellCards = counts.spell;
        $scope.totalLandCards = counts.land;
    }

    function filterCards() {
        $scope.topRow = [{loading: true}, {loading: true}, {loading: true}, {loading: true}];
        $scope.botRow = [{loading: true}, {loading: true}, {loading: true}, {loading: true}];
        cardService.getCards().then(function (cards) {
            if(hideDupes){
                cards = removeDuplicates("name", cards);
            }
            if(hideBanned){
                cards = removeBanned(cards);
            }
            cardService.setFilteredCards(cards);
            var filteredCards = cardService.filteredCards;
            paginateService.setMaxPages(filteredCards);
            cardService.changePage();
            updatePage();
        });

    }

    function validatePageChange() {
        if (paginateService.noBack()) {
            $("#back").css("display", "none");
        } else {
            $("#back").css("display", "inherit");
        }

        if (paginateService.noForward()) {
            $("#forward").css("display", "none");
        } else {
            $("#forward").css("display", "inherit");
        }
    }

    $scope.showHover = function (card) {
        $scope.isHover = true;
        $scope.hoverCard = card;
    };

    $scope.hideHover = function () {
        $scope.isHover = false;
        $scope.hoverCard = null;
    };

    function updatePage() {
        applyCardsLeft();
        $scope.topRow = cardService.topRow;
        $scope.botRow = cardService.botRow;
        validatePageChange();
        $scope.currentPage = paginateService.getCurrentPage();
        $scope.totalPage = paginateService.getMaxPage();
        $scope.$apply();
    }

    function applyCardsLeft() {
        var displayDeck = deckService.displayDeck;
        cardService.getCardsLeft(displayDeck);
    }

    function init() {
        filterCards();
        var banned = $cookies.get('bannedSelection');
        var duplicates = $cookies.get('duplicateSelection');
        console.log(banned + "-" + duplicates);
        if(banned){
            hideBanned = banned;
            $("#banned").prop('checked', hideBanned);
        }
        if(duplicates){
            hideDupes = duplicates;
            $("#duplicates").prop('checked', hideDupes);
        }
    }

    init();
});