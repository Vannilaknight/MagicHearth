angular.module('app').controller('adminCtrl', function ($scope, Auth, $location) {
    $scope.signup = function(username, password, confirm) {
        var newAdminData = {
            username: username,
            password: password,
        };

        if(confirm == newAdminData.password){
            Auth.createAdmin(newAdminData).then(function() {
                $location.path("/builder");
            }, function(reason) {
                console.log(reason)
            })
        } else {
            console.log("no matching passes")
        }
    }
});