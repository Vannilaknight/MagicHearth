angular.module('app').controller('mainCtrl', function ($scope, $http) {
    var currentPage = 1;
    var currentColors = [];
    var andColors = false;
    $scope.topRow = [];
    $scope.botRow = [];

    $("#back").click(function () {
        pageChange("left")
    });

    $("#forward").click(function () {
        pageChange("right")
    });

    $("#b").change(function(event) {
        var checkbox = event.target;
        currentPage = 1;
        if (checkbox.checked) {
            currentColors.push("B");
        } else {
            var index = currentColors.indexOf("B");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#w").change(function(event) {
        var checkbox = event.target;
        currentPage = 1;
        if (checkbox.checked) {
            currentColors.push("W");
        } else {
            var index = currentColors.indexOf("W");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#u").change(function(event) {
        var checkbox = event.target;
        currentPage = 1;
        if (checkbox.checked) {
            currentColors.push("U");
        } else {
            var index = currentColors.indexOf("U");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#r").change(function(event) {
        var checkbox = event.target;
        currentPage = 1;
        if (checkbox.checked) {
            currentColors.push("R");
        } else {
            var index = currentColors.indexOf("R");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#g").change(function(event) {
        var checkbox = event.target;
        currentPage = 1;
        if (checkbox.checked) {
            currentColors.push("G");
        } else {
            var index = currentColors.indexOf("G");
            currentColors.splice(index, 1);
        }
        colorFilter();
    });

    $("#and").change(function(event) {
        var checkbox = event.target;
        currentPage = 1;
        if (checkbox.checked) {
            andColors = true;
        } else {
            andColors = false;
        }
        colorFilter();
    });


    function colorFilter() {
        console.log(currentColors);
        if(andColors){
            changePage("&page=" + currentPage + "&colors=" + currentColors.join(",") + "&op=and");
        } else {
            changePage("&page=" + currentPage + "&colors=" + currentColors.join(","));
        }
    }

    function pageChange(direction) {
        if (direction) {
            if (direction == "left") {
                if (currentPage >= 1) {
                    currentPage--;
                }
            } else {
                currentPage++;
            }
            colorFilter();
        } else {
            colorFilter();
        }
    }

    function changePage(params = "") {
        $http({
            method: 'GET',
            url: '/api/cards?format=modern' + params
        }).then(function successCallback(response) {
            $scope.topRow = [];
            $scope.botRow = [];
            var data = response.data;
            if(data.length < 8){
                $("#forward").css("display", "none");
            } else {
                $("#forward").css("display", "inherit");
            }
            for(var x = 0; x < data.length; x++){
                if(x < 4){
                    $scope.topRow.push(data[x]);
                } else {
                    $scope.botRow.push(data[x]);
                }
            }
        }, function errorCallback(response) {
            console.error(response.data)
        });
    }

    changePage();
});