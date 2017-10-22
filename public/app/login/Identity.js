angular.module('app').factory('Identity', function ($window, User, $rootScope, $cookies) {
    var currentUser;
    var oldUser = $cookies.getObject('currentUser');
    if(oldUser){
        currentUser = oldUser;
        $rootScope.currentUser = oldUser;
    }

    return {
        currentUser: currentUser,
        isAuthenticated: function () {
            return !!this.currentUser;
        },
        isAuthorized: function (role) {
            return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
        }
    }
});