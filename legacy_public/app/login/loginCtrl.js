angular.module('app').controller('loginCtrl', function($scope, $rootScope, $http, Identity, Auth, $location, $cookies) {
    $scope.identity = Identity;
    $rootScope.gIdentity = Identity;
    $scope.signin = function(username, password) {
        Auth.authenticateUser(username, password).then(function(success) {
            if(success) {
                $location.path('/builder');
            } else {
                $location.path('/login');
            }
        });
    }

    $scope.signout = function() {
        Auth.logoutUser().then(function() {
            $scope.username = "";
            $scope.password = "";
            $location.path('/login');
        })
    }
});