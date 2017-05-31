angular.module('app').controller('mainCtrl', function ($scope, $http) {
    var currentPage = 1;
    var currentColors = [];
    var andColors = false;
    var params = {
        page: 1,
        colors: "",
        colorop: "",
        cmcop: "",
        searchText: "",
        format: "standard"
    };

    $scope.formatSelect = "standard";
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

    $("#b").change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            currentColors.push("B");
        } else {
            var index = currentColors.indexOf("B");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#w").change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            currentColors.push("W");
        } else {
            var index = currentColors.indexOf("W");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#u").change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            currentColors.push("U");
        } else {
            var index = currentColors.indexOf("U");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#r").change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            currentColors.push("R");
        } else {
            var index = currentColors.indexOf("R");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#g").change(function (event) {
        var checkbox = event.target;
        if (checkbox.checked) {
            currentColors.push("G");
        } else {
            var index = currentColors.indexOf("G");
            currentColors.splice(index, 1);
        }
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


    function colorFilter() {
        params.colors = currentColors.join(",");
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