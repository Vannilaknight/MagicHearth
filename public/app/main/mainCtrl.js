angular.module('app').controller('mainCtrl', function ($scope, $rootScope, $http, $window, $cookies) {
    $scope.importExample = "2x Aetherworks Marvel\n3x Glimmer of Genius\n20x Plains";
    var cards = null;
    var filteredCards = null;
    var searchedCards = null;
    var finalCards = null;

    $scope.formatFilter = "Standard";
    $scope.typeFilter = [];
    $scope.colorFilter = [];
    $scope.costFilter = [];
    $scope.rarityFilter = [];
    $scope.cardSearch = "";

    $scope.displayCards = [];

    $scope.currentHover = null;

    $scope.sidenavState = 'nav';
    $scope.deck = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;

    var maxPages = 50;

    $scope.selectedTypes = [];
    $scope.types = [
        {id: "Creature", label: "Creature"},
        {id: "Instant", label: "Instant"},
        {id: "Sorcery", label: "Sorcery"},
        {id: "Planeswalker", label: "Planeswalker"},
        {id: "Enchantment", label: "Enchantment"},
        {id: "Artifact", label: "Artifact"},
        {id: "Land", label: "Land"}
    ];

    $scope.eventSettings = {
        onSelectionChanged: function () {
            filterCards();
        }
    };

    $scope.extraSettings = {
        smartButtonMaxItems: 3,
        selectionLimit: 3,
        showCheckAll: false,
        showUncheckAll: false
    };

    $scope.$watch('deck', function (newVal, oldVal) {
        divideTypes($scope.deck);
    }, true);

    $scope.$watch('cardSearch', function (newVal, oldVal) {
        if (cards) {
            filterCards();
        }
    }, true);

    function filterCards() {
        filteredCards = applyFilters(cards, $scope.typeFilter, $scope.colorFilter, $scope.costFilter, $scope.rarityFilter);
        searchedCards = applySearch(filteredCards, $scope.cardSearch);
        calculatePages(searchedCards);
    }

    function calculatePages(calcCards) {
        finalCards = calcCards;
        $scope.totalPages = finalCards.length / maxPages;
        $scope.currentPage = 1;
        $scope.displayCards = finalCards.slice(($scope.currentPage - 1) * maxPages, ($scope.currentPage * maxPages) + 1);
    }

    function divideTypes(deck) {
        $scope.creatures = [];
        $scope.spells = [];
        $scope.lands = [];

        var sorted = getSortedDisplayDeck(deck);
        $scope.creatures = sorted.creature;
        $scope.spells = sorted.spell;
        $scope.lands = sorted.land;
    }

    $scope.nextPage = function () {
        if ($scope.totalPages >= $scope.currentPage) {
            $scope.currentPage++;
            if ($scope.currentPage == $scope.totalPages) {
                $scope.displayCards = finalCards.slice(($scope.currentPage - 1) * maxPages, $scope.cards.length);
            } else {
                $scope.displayCards = finalCards.slice(($scope.currentPage - 1) * maxPages, ($scope.currentPage * maxPages) + 1);
            }
        }
    };

    $scope.backPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.displayCards = finalCards.slice(($scope.currentPage - 1) * maxPages, ($scope.currentPage * maxPages) + 1);
        }
    };


    $http.get('/api/modernCards').then(function (response) {
        cards = response.data;
        filterCards();
    });

    $scope.changeSidenavState = function (state) {
        $scope.sidenavState = state;
    };

    $scope.getCardColorClass = function (colors) {
        var classname = "";
        var white = false, blue = false, black = false, red = false, green = false;
        colors.forEach(function (color) {
            if (color == "White") {
                white = true;
            }
            if (color == "Blue") {
                blue = true;
            }
            if (color == "Black") {
                black = true;
            }
            if (color == "Red") {
                red = true;
            }
            if (color == "Green") {
                green = true;
            }
        });

        if (white) {
            classname += "white-";
        }
        if (blue) {
            classname += "blue-";
        }
        if (black) {
            classname += "black-";
        }
        if (red) {
            classname += "red-";
        }
        if (green) {
            classname += "green-";
        }

        classname += "card";
        return classname;
    };

    $scope.inspect = function (card) {
        if (card == $scope.inspectedCard) {
            $scope.inspectedCard = null;
        } else {
            $scope.inspectedCard = card;
        }
    };

    $scope.hoverViewIn = function (id) {
        $scope.currentHover = id;
    };

    $scope.moveImg = function ($event) {
        var x = $event.offsetX;
        var y = $event.offsetY;

        var tooltip = document.getElementById($scope.currentHover);
        console.log($event.pageY + " - " + window.innerHeight/2)
        if ($event.pageY  >= window.innerHeight - 445) {
            tooltip.style.top = (y + ((window.innerHeight - $event.pageY) - 445)) + 'px';
        } else {
            tooltip.style.top = (y + 20) + 'px';
        }
        tooltip.style.left = (x + 20) + 'px';
    };

    $scope.hoverViewOut = function () {
        $scope.currentHover = null;
    };

    $scope.add = function (card, count) {
        for (var x = 0; x < count; x++) {
            $scope.deck.push(card);
        }
    };

    $scope.remove = function (card, count) {
        for (var t = 0; t < count; t++) {
            for (var x = 0; x < $scope.deck.length; x++) {
                if ($scope.deck[x].name === card.name) {
                    $scope.deck.splice(x, 1);
                    break;
                }
            }
        }
    };

    $scope.getManaCost = function (mana) {
        var manaCost = [];
        if (mana) {
            manaCost = mana.replaceAll("{", "").replaceAll("}", "").split("");
        }
        return manaCost;
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
        } else if (mana == "X") {
            ret = "icon-x";
        } else {
            ret = "icon-" + mana;
        }
        return ret;
    };


    $scope.getCount = function (i) {
        var iCount = 0;
        for (var j = 0; j < $scope.deck.length; j++) {
            if ($scope.deck[j].name == i) {
                iCount++;
            }
        }
        return iCount;
    };

    $scope.exportDeck = function () {
        $scope.exportedDeck = "";
        var displayDeck = reduceArrayP2($scope.deck);
        if (displayDeck.length >= 1) {
            for (var i = 0; i < displayDeck.length; i++) {
                $scope.exportedDeck += (displayDeck[i].count + "x");
                $scope.exportedDeck += (" " + displayDeck[i].name);
                $scope.exportedDeck += "\r\n";
            }
            $scope.exportFile = createExportFile($window, $scope.exportedDeck);
        }
        else {
            $scope.exportedDeck = "No cards in deck."
        }
    };

    $scope.importDeck = function (importedString, willOverride) {
        importDeck(importedString).then(function (imported) {
            if (willOverride) {
                $scope.deck = imported;
            } else {
                $scope.deck = $scope.deck.concat(imported);
            }
        });
    };

    function createExportFile($window, textToWrite) {
        var text = textToWrite;
        var blob = new Blob([text], {type: "text/plain"}),
            url = $window.URL || $window.webkitURL;
        return url.createObjectURL(blob);
    }

    function importDeck(importedString) {
        return $http({
            method: 'GET',
            url: '/api/buildImport?importedString=' + importedString
        }).then(function responseCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            console.error(response.data);
        });
    }


}).filter('roundup', function () {
    return function (value) {
        return Math.ceil(value);
    };
}).filter('unique', function () {

    return function (arr, field) {
        var o = {}, i, l = arr.length, r = [];
        for (i = 0; i < l; i += 1) {
            o[arr[i][field]] = arr[i];
        }
        for (i in o) {
            r.push(o[i]);
        }
        return r;
    };
});