angular.module('app').controller('mainCtrl', function ($scope, $http) {
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

    $("#back").click(function () {
        pageChange("left")
    });

    $("#forward").click(function () {
        pageChange("right")
    });

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

    function rarityChange(rarity, event){
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

    function colorChange(color, event){
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

    function CMCChange(number, event){
        var checkbox = event.target;
        if (checkbox.checked) {
            currentCMC.push(number);
        } else {
            var index = currentColors.indexOf(number);
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
            console.log(data)
            if (data.length < 8) {
                $("#forward").css("display", "none");
            } else {
                $("#forward").css("display", "inherit");
            }
            for (var x = 0; x < data.length; x++) {
                if (x < 4) {
                    $scope.topRow.push(data[x]);
                } else {
                    $scope.botRow.push(data[x]);
                }
            }
        }, function errorCallback(response) {
            console.error(response.data)
        });
    }

    function pageOne() {
        currentPage = 1;
        params.page = currentPage;
    }

    changePage();
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