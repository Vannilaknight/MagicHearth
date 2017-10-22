angular.module('app', ['ngResource', 'ngRoute', 'ngAnimate', 'ngCookies', 'dndLists', 'ui.bootstrap', 'angular-preload-image', 'angularjs-dropdown-multiselect'])
    .config(function ($routeProvider, $locationProvider, $compileProvider) {
        var routeRoleChecks = {
            admin: {
                auth: function (Auth) {
                    return Auth.authorizeCurrentUserForRoute('admin')
                }
            },
            user: {
                auth: function (Auth) {
                    return Auth.authorizeAuthenticatedUserForRoute()
                }
            }
        }

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/edit', {
                templateUrl: '/partials/cardEdit/cardEdit',
                controller: 'cardEditCtrl',
                resolve: routeRoleChecks.admin
            })
            .when('/challenge', {
                templateUrl: '/partials/challenge/challenge',
                controller: 'challengeCtrl',
                resolve: routeRoleChecks.admin
            })
            .when('/builder', {
                templateUrl: '/partials/main/main',
                controller: 'mainCtrl',
                resolve: routeRoleChecks.admin
            })
            .when('/login', {
                templateUrl: '/partials/login/login',
                controller: 'loginCtrl'
            })
            .when('/', {
                templateUrl: '/partials/landing/landing',
                controller: 'landingCtrl',
                resolve: routeRoleChecks.admin
            })

    })
    .factory('$exceptionHandler', function ($log) {
        return function myExceptionHandler(exception, cause) {
            if (!exception.toString().includes("$rootScope:inprog")) {
                $log.error(exception, cause)
            }

        };
    })
    .run(function ($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
            if (rejection === 'not authorized') {
                $location.path('/login');
            }
        })
    });
