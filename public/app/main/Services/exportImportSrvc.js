angular.module('app').service('exportImportService', function ($http) {
    this.createExportFile = function ($window, textToWrite) {
        var text = textToWrite;
        var blob = new Blob([text], {type: "text/plain"}),
            url = $window.URL || $window.webkitURL;
        return url.createObjectURL(blob);
    };

    this.import = function (importedString) {
        return $http({
            method: 'GET',
            url: '/api/buildImport?importedString=' + importedString
        }).then(function responseCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            console.error(response.data);
        });
    }
});

