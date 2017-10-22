angular.module('app').controller('editorCtrl', function ($scope, $http) {
    $http.get("/api/allSets").then(function (data) {
        var sets = data.data;
        console.log(sets);
    })
});