angular.module('app', ['ngResource', 'ngRoute', 'ngAnimate', 'ngCookies', 'dndLists', 'ui.bootstrap', 'angular-preload-image'])
    .config(function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/challenge', {
                templateUrl: '/partials/challenge/challenge',
                controller: 'challengeCtrl'
            })
            .when('/', {
                templateUrl: '/partials/main/main',
                controller: 'mainCtrl'
            })
    })
    .run(function ($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
            if (rejection === 'not authorized') {
                $location.path('/login');
            }
        })
    });
