angular.module('app').controller('mainCtrl', function ($scope, $http, $uibModal) {
    $scope.importExample = "2x Aetherworks Marvel\n3x Glimmer of Genius\n20x Plains";

    var currentPage = 1;
    var currentColors = [];
    var currentCMC = [];
    var currentRarities = [];
    var andColors = false;
    var params = {
        page: 1,
        colors: "",
        cmcs: "",
        colorop: "",
        rarities: "",
        searchText: "",
        type: "",
        format: "standard"
    };

    $scope.formatSelect = "standard";
    $scope.typeFilter = "none";
    $scope.topRow = [];
    $scope.botRow = [];
    $scope.decklist = [];
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
        calcCardsLeft();
    }, true);

    $scope.getBorder = function (colorIdentity) {
        var colors = {
            "U": false,
            "W": false,
            "B": false,
            "R": false,
            "G": false,
        };
        colorIdentity.forEach(function (color) {
            if(color == "U"){
                colors[color] = true;
            }
            if(color == "W"){
                colors[color] = true;
            }
            if(color == "B"){
                colors[color] = true;
            }
            if(color == "R"){
                colors[color] = true;
            }
            if(color == "G"){
                colors[color] = true;
            }
        });
        var classString = "";
        if(colors["U"]){
            classString += "-U";
        }
        if(colors["W"]){
            classString += "-W";
        }
        if(colors["B"]){
            classString += "-B";
        }
        if(colors["R"]){
            classString += "-R";
        }
        if(colors["G"]){
            classString += "-G";
        }
        return classString + "-border";
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

    $scope.searchText = function (text) {
        params.searchText = text;
        pageOne();
        changePage();
    };

    $scope.formatChange = function (format) {
        params.format = format;
        pageOne();
        changePage();
    };

    $scope.typeChange = function (type) {
        params.type = type;
        pageOne();
        changePage();
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
    };

    $scope.importDeck = function (importedString) {
        $http({
            method: 'GET',
            url: '/api/buildImport?importedString=' + importedString
        }).then(function responseCallback(response) {
            $scope.models.dropzones.deck = response.data;
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
            params.colorop = "and";
        } else {
            params.colorop = "";
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
        pageOne();
        changePage();
    }

    function cmcFilter() {
        params.cmcs = currentCMC.join(",");
        pageOne();
        changePage();
    }

    function rarityFilter() {
        params.rarities = currentRarities.join(",");
        pageOne();
        changePage();
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
            params.page = currentPage;
            changePage();
        } else {
            changePage();
        }
    }

    function changePage() {
        $http({
            method: 'GET',
            url: '/api/cards?' + objectToString(params)
        }).then(function successCallback(response) {
            $scope.topRow = [];
            $scope.botRow = [];
            var data = response.data;
            if (data.length < 8) {
                $("#forward").css("display", "none");
            } else {
                $("#forward").css("display", "inherit");
            }
            for (var x = 0; x < data.length; x++) {
                data[x].empty = false;
                if (x < 4) {
                    $scope.topRow.push(data[x]);
                } else {
                    $scope.botRow.push(data[x]);
                }
            }
            if ($scope.topRow.length < 4) {
                for (var q = 0; q < 4 - $scope.topRow.length; q++) {
                    $scope.topRow.push({
                        empty: true
                    })
                }
                for (var w = 0; w < 4; w++) {
                    $scope.botRow.push({
                        empty: true
                    })
                }
            }
            calcCardsLeft();
        }, function errorCallback(response) {
            console.error(response.data)
        });
    }

    function pageOne() {
        currentPage = 1;
        params.page = currentPage;
    }


    changePage();

    function calcCardsLeft() {
        var displayDeck = $scope.displayDeck;
        var topRow = $scope.topRow;
        var botRow = $scope.botRow;

        for (var x = 0; x < topRow.length; x++) {
            var card = topRow[x];
            if (!card.cardsLeft) {
                card.cardsLeft = 4;
            }
            if (displayDeck.length >= 1) {
                var notFound = true;
                displayDeck.forEach(function (displayCard) {
                    if (card.name == displayCard.name) {
                        $scope.topRow[x].cardsLeft = 4 - displayCard.count;
                        notFound = false;
                    }
                });
                if (notFound) {
                    if (card.cardsLeft == 3) {
                        $scope.topRow[x].cardsLeft = 4;
                    }
                }
            } else {
                $scope.topRow[x].cardsLeft = 4;
            }
        }

        for (var x = 0; x < botRow.length; x++) {
            var card = botRow[x];
            if (!card.cardsLeft) {
                card.cardsLeft = 4;
            }
            if (displayDeck.length >= 1) {
                var notFound = true;
                displayDeck.forEach(function (displayCard) {
                    if (card.name == displayCard.name) {
                        $scope.botRow[x].cardsLeft = 4 - displayCard.count;
                        notFound = false;
                    }
                });
                if (notFound) {
                    if (card.cardsLeft == 3) {
                        $scope.botRow[x].cardsLeft = 4;
                    }
                }
            } else {
                $scope.botRow[x].cardsLeft = 4;
            }
        }
    }
});

function objectToString(obj) {
    var returnStr = "";
    for (var prop in obj) {
        var value = obj[prop];
        if (value) {
            returnStr += "&" + prop + "=" + obj[prop];
        }
    }
    return returnStr;
}

function reduceArrayP2(cards) {
    var counts = {};

    cards.forEach(function (card) {
        if (!counts.hasOwnProperty(card.name)) {
            counts[card.name] = card;
            counts[card.name].count = 1;
        } else {
            counts[card.name].count += 1;
        }
    });

    var newArray = [];
    for (var name in counts) {
        var card = counts[name];
        if (card) {
            newArray.push(card);
        }
    }

    return newArray;
}

var myCounter = 0,
    myOtherCounter = 0;
var scroll = 0;

//Firefox
// $(document).bind(...) this works as well
$('body').bind('DOMMouseScroll', function (e) {
    if (e.originalEvent.detail > 0) {
        scrollDown();
    } else {
        scrollUp();
    }

    //prevent page fom scrolling
    return false;
});

//IE, Opera, Safari
$('body').bind('mousewheel', function (e) {
    if (e.originalEvent.wheelDelta < 0) {
        scrollDown();
    } else {
        scrollUp();
    }
    //prevent page fom scrolling
    return false;
});

function scrollDown() {
    if (scroll < $('#display-box').find('div').height() - $('#display-box').height() + 20) {
        scroll = $('#display-box').scrollTop() + 8;
        $('#display-box').scrollTop(scroll);
    }
};

function scrollUp() {
    if (scroll > 0) {
        scroll = $('#display-box').scrollTop() - 8;
        $('#display-box').scrollTop(scroll);
    }
};
