'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */

angular
    .module('core', ['ngCordova', 'ngMaterial'])
    .config(['$stateProvider',
        '$urlRouterProvider',
        '$mdThemingProvider',
        function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

            $mdThemingProvider.theme('default')
                .primaryPalette('deep-purple')
                .accentPalette('purple')

            $urlRouterProvider.otherwise('/');

            /**
             * @ngdoc event
             * @name core.config.route
             * @eventOf core.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the path is `'/'`, route to home
             * */
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'modules/core/views/home.html',
                    controller: 'HomeController'
                });
            $stateProvider
                .state('createJoce', {
                    url: '/createJoce',
                    templateUrl: 'modules/core/views/createJoce.html',
                    controller: 'createJoceController'
                });
            $stateProvider
                .state('showJoce', {
                    url: '/showJoce/:joceId',
                    templateUrl: 'modules/core/views/showJoce.html',
                    controller: 'showJoceController'
                });
            $stateProvider
                .state('editJoce', {
                    url: '/editJoce/:joceId',
                    templateUrl: 'modules/core/views/editJoce.html',
                    controller: 'editJoceController'
                });
            $stateProvider
                .state('addJocex', {
                    url: '/addJocex/:joceId',
                    templateUrl: 'modules/core/views/addJocex.html',
                    controller: 'addJocexController'
                });
            $stateProvider
                .state('tutorial', {
                    url: '/tutorial',
                    templateUrl: 'modules/core/views/tutorial.html',
                    controller: 'tutorialController'
                });
            $stateProvider
                .state('about', {
                    url: '/about',
                    templateUrl: 'modules/core/views/about.html',
                    controller: 'aboutController'
                });
            $stateProvider
                .state('shareApp', {
                    url: '/shareApp',
                    templateUrl: 'modules/core/views/shareApp.html',
                    controller: 'shareAppController'
                });
        }
    ]);
