angular.module('app').factory('Identity', function ($window, User, $rootScope) {
    var currentUser;
    if (!!$window.bootstrappedUserObject) {
        currentUser = new User();
        $rootScope.currentUserId = currentUser;
        console.log("/currentUser : " + $rootScope.currentUserId);
        angular.extend(currentUser, $window.bootstrappedUserObject);
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
})