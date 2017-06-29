angular.module('app', ['ngResource', 'ngRoute', 'ngAnimate', 'ngCookies', 'dndLists', 'ui.bootstrap', 'angular-preload-image'])
    .config(function ($routeProvider, $locationProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/challenge', {
                templateUrl: '/partials/challenge/challenge',
                controller: 'challengeCtrl'
            })
            .when('/builder', {
                templateUrl: '/partials/main/main',
                controller: 'mainCtrl'
            })
            .when('/', {
                templateUrl: '/partials/landing/landing',
                controller: 'landingCtrl'
            })
            .when('/reference', {
                templateUrl: '/partials/reference/reference',
                controller: 'referenceCtrl'
            })
    })

    .factory('$exceptionHandler', function ($log) {
        return function myExceptionHandler(exception, cause) {
            if(!exception.toString().includes("$rootScope:inprog")){
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
