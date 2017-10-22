angular.module('app').controller('overlordCtrl', function ($scope, $location, Auth) {
    $scope.signout = function() {
        Auth.logoutUser().then(function() {
            $location.path('/login');
        })
    }
});
