var user;
angular.module('app').factory('Auth', function ($http, $rootScope, Identity, $q, User, Admin, $cookies) {
    return {
        authenticateUser: function (username, password) {
            var dfd = $q.defer();

            $http.post('/login', {username: username, password: password}).then(function (response) {
                if (response.data.success) {
                    user = new User();
                    angular.extend(user, response.data.user);
                    Identity.currentUser = user;
                    $rootScope.currentUser = user;
                    console.log($rootScope.currentUser);
                    $cookies.putObject('currentUser', Identity.currentUser);
                    dfd.resolve(true);
                } else {
                    dfd.resolve(false);
                }
            });
            return dfd.promise;
        },

        createAdmin: function (newAdminData) {
            var newAdmin = new Admin(newAdminData);
            var dfd = $q.defer();

            newAdmin.$save().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });

            return dfd.promise;
        },

        updateCurrentUser: function (newUserData) {
            var dfd = $q.defer();

            var clone = angular.copy(Identity.currentUser);
            angular.extend(clone, newUserData);
            clone.$update().then(function () {
                Identity.currentUser = clone;
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },

        logoutUser: function () {
            var dfd = $q.defer();
            $http.post('/logout', {logout: true}).then(function () {
                Identity.currentUser = undefined;
                $rootScope.currentUserId = '';
                dfd.resolve();
            });
            return dfd.promise;
        },
        authorizeCurrentUserForRoute: function (role) {
            if (Identity.isAuthorized(role)) {
                return true;
            } else {
                return $q.reject('not authorized');
            }

        },
        authorizeAuthenticatedUserForRoute: function () {
            if (Identity.isAuthenticated()) {
                return true;
            } else {
                return $q.reject('not authorized');
            }
        }
    }
});