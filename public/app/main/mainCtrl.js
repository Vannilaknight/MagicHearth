angular.module('app').controller('mainCtrl', function ($scope, $http, $window, deckbuilderService) {
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

    $scope.formatSelect = "modern";
    $scope.typeFilter = "none";
    $scope.topRow = [];
    $scope.botRow = [];
    $scope.decklist = [];
    $scope.isHover = false;
    $scope.hoverId = "";
    $scope.exportedDeck = "";

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
        $scope.decklist = $scope.models.dropzones.deck;
        $scope.displayDeck = reduceArrayP2($scope.decklist);
        var sortedDeck = deckbuilderService.getSortedDisplayDeck($scope.displayDeck);
        $scope.displayDeck = (sortedDeck.creature.concat(sortedDeck.spell)).concat(sortedDeck.land);
        $scope.creatureDeck = sortedDeck.creature;
        $scope.spellDeck = sortedDeck.spell;
        $scope.landDeck = sortedDeck.land;
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

    $scope.getManaCost = function (card) {
        var manaCost = [];
        if (card.manaCost) {
            manaCost = card.manaCost.replaceAll("{", "").replaceAll("}", "").split("");
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
        } else {
            ret = "icon-" + mana;
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
        if (card.cardsLeft > 0) {
            console.log("pushing: " + card.cardsLeft);
            $scope.models.dropzones.deck.push(card);
        }
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
        $scope.exportedDeck = "";
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

    $scope.exportToFile = function() {
        $scope.exportDeck();
        var text = $scope.exportedDeck;
            blob = new Blob([text], {type: "text/plain"}),
            url = $window.URL || $window.webkitURL;
        $scope.fileUrl = url.createObjectURL(blob);
    }

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
        $scope.totalCreatureCards = deckbuilderService.getTotalCardCount($scope.creatureDeck);
        $scope.totalSpellCards = deckbuilderService.getTotalCardCount($scope.spellDeck);
        $scope.totalLandCards = deckbuilderService.getTotalCardCount($scope.landDeck);
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
                    card.price = deckbuilderService.getRandomPrice();
                    card.empty = false;
                    $scope.topRow[index] = card;
                } else {
                    $scope.topRow[index] = {empty: true};
                }
            } else {
                if (card) {
                    card.price = deckbuilderService.getRandomPrice();
                    card.empty = false;
                    $scope.botRow[index - 4] = card;
                } else {
                    $scope.botRow[index - 4] = {empty: true}
                }
            }
        }
        calcCardsLeft();
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

    $scope.showHover = function (card) {
        $scope.isHover = true;
        $scope.hoverCard = card;
    };

    $scope.hideHover = function () {
        $scope.isHover = false;
        $scope.hoverCard = null;
    };

    $scope.randomPrice = function () {
        return
    };

    filterCards();
});

var saveAs = saveAs || (function(view) {
        "use strict";
        // IE <10 is explicitly unsupported
        if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
            return;
        }
        var
            doc = view.document
            // only get URL when necessary in case Blob.js hasn't overridden it yet
            , get_URL = function() {
                return view.URL || view.webkitURL || view;
            }
            , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
            , can_use_save_link = "download" in save_link
            , click = function(node) {
                var event = new MouseEvent("click");
                node.dispatchEvent(event);
            }
            , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
            , is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
            , throw_outside = function(ex) {
                (view.setImmediate || view.setTimeout)(function() {
                    throw ex;
                }, 0);
            }
            , force_saveable_type = "application/octet-stream"
            // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
            , arbitrary_revoke_timeout = 1000 * 40 // in ms
            , revoke = function(file) {
                var revoker = function() {
                    if (typeof file === "string") { // file is an object URL
                        get_URL().revokeObjectURL(file);
                    } else { // file is a File
                        file.remove();
                    }
                };
                setTimeout(revoker, arbitrary_revoke_timeout);
            }
            , dispatch = function(filesaver, event_types, event) {
                event_types = [].concat(event_types);
                var i = event_types.length;
                while (i--) {
                    var listener = filesaver["on" + event_types[i]];
                    if (typeof listener === "function") {
                        try {
                            listener.call(filesaver, event || filesaver);
                        } catch (ex) {
                            throw_outside(ex);
                        }
                    }
                }
            }
            , auto_bom = function(blob) {
                // prepend BOM for UTF-8 XML and text/* types (including HTML)
                // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
                if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                    return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
                }
                return blob;
            }
            , FileSaver = function(blob, name, no_auto_bom) {
                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                // First try a.download, then web filesystem, then object URLs
                var
                    filesaver = this
                    , type = blob.type
                    , force = type === force_saveable_type
                    , object_url
                    , dispatch_all = function() {
                        dispatch(filesaver, "writestart progress write writeend".split(" "));
                    }
                    // on any filesys errors revert to saving with object URLs
                    , fs_error = function() {
                        if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                            // Safari doesn't allow downloading of blob urls
                            var reader = new FileReader();
                            reader.onloadend = function() {
                                var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                                var popup = view.open(url, '_blank');
                                if(!popup) view.location.href = url;
                                url=undefined; // release reference before dispatching
                                filesaver.readyState = filesaver.DONE;
                                dispatch_all();
                            };
                            reader.readAsDataURL(blob);
                            filesaver.readyState = filesaver.INIT;
                            return;
                        }
                        // don't create more object URLs than needed
                        if (!object_url) {
                            object_url = get_URL().createObjectURL(blob);
                        }
                        if (force) {
                            view.location.href = object_url;
                        } else {
                            var opened = view.open(object_url, "_blank");
                            if (!opened) {
                                // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                                view.location.href = object_url;
                            }
                        }
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                        revoke(object_url);
                    }
                ;
                filesaver.readyState = filesaver.INIT;

                if (can_use_save_link) {
                    object_url = get_URL().createObjectURL(blob);
                    setTimeout(function() {
                        save_link.href = object_url;
                        save_link.download = name;
                        click(save_link);
                        dispatch_all();
                        revoke(object_url);
                        filesaver.readyState = filesaver.DONE;
                    });
                    return;
                }

                fs_error();
            }
            , FS_proto = FileSaver.prototype
            , saveAs = function(blob, name, no_auto_bom) {
                return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
            }
        ;
        // IE 10+ (native saveAs)
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
            return function(blob, name, no_auto_bom) {
                name = name || blob.name || "download";

                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                return navigator.msSaveOrOpenBlob(blob, name);
            };
        }

        FS_proto.abort = function(){};
        FS_proto.readyState = FS_proto.INIT = 0;
        FS_proto.WRITING = 1;
        FS_proto.DONE = 2;

        FS_proto.error =
            FS_proto.onwritestart =
                FS_proto.onprogress =
                    FS_proto.onwrite =
                        FS_proto.onabort =
                            FS_proto.onerror =
                                FS_proto.onwriteend =
                                    null;

        return saveAs;
    }(
        typeof self !== "undefined" && self
        || typeof window !== "undefined" && window
        || this.content
    ));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
    define("FileSaver.js", function() {
        return saveAs;
    });
}
