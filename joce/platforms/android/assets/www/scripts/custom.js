'use strict';
var ApplicationConfiguration = (function() {
    var applicationModuleName = 'angularjsapp';
    var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils'];
    var registerModule = function(moduleName) {
        angular
            .module(moduleName, []);
        angular
            .module(applicationModuleName)
            .requires
            .push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });

'use strict';

ApplicationConfiguration.registerModule('core');

'use strict';

angular
    .module('core')
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

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
                .state('addJocex', {
                    url: '/addJocex/:joceId',
                    templateUrl: 'modules/core/views/addJocex.html',
                    controller: 'addJocexController'
                });
        }
    ]);

'use strict';

angular
    .module('core')
    .controller('addJocexController', ['$scope', '$location', '$stateParams', '$timeout',
        function($scope, $location, $stateParams, $timeout) {
          $scope.go = function (path) {
            $location.path(path);
          };
          $scope.submit = function () {
            var jocex = {
              text:$scope.jocex,
              joceId:$stateParams.joceId
            };
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS jocex(id INTEGER PRIMARY KEY ASC, text TEXT, joceId TEXT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql("INSERT INTO jocex (text, joceId) VALUES (?,?)",[jocex.text, jocex.joceId], function (tx, results) {
              });
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM joce', [], function (tx, results) {
              }, null);
            });
            $location.path('/home');
          };
          function getJocexs (){
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS jocex(id INTEGER PRIMARY KEY ASC, text TEXT, joceId TEXT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM jocex', [], function (tx, results) {
                var jocexsDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  if (results.rows.item(i).joceId == $stateParams.joceId){
                    jocexsDb.push(results.rows.item(i))
                  }
                }
                $timeout(function(){
                  $scope.lastestJocex = jocexsDb[jocexsDb.length -1];
                });
              }, null);
            });
          };
          getJocexs();
        }
    ]);
'use strict';

angular
    .module('core')
    .controller('createJoceController', ['$scope', '$location', '$timeout',
        function($scope, $location, $timeout) {
          $scope.submit = function () {
            var joce = {
              name:$scope.name,
              number:$scope.number,
              time:$scope.time,
              minumum:$scope.minumum,
              maximum:$scope.maximum
            };
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number TEXT, time TEXT, minumum TEXT, maximum TEXT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql("INSERT INTO joce (name, number, time, minumum, maximum) VALUES (?,?,?,?,?)",[joce.name, joce.number, joce.time, joce.minumum, joce.maximum], function (tx, results) {
                $timeout(function(){
                  $location.path('/addJocex/'+results.insertId);
                });
              });
            });
          };
        }
    ]);
'use strict';

angular
    .module('core')
    .controller('HomeController', ['$scope', '$location', '$timeout',
        function($scope, $location, $timeout) {
          $scope.go = function (path) {
            $location.path(path);
          };
          function getJoces (){
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number TEXT, time TEXT, minumum TEXT, maximum TEXT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM joce', [], function (tx, results) {
                var jocesDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  jocesDb.push(results.rows.item(i))
                }
                $timeout(function(){
                  $scope.joces = jocesDb;
                });
              }, null);
            });
          };
          getJoces();
        }
    ]);
