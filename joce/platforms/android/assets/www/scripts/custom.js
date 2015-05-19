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
            var number = null;
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, minumum INT, maximum INT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM joce WHERE id=?', [$stateParams.joceId], function (tx, results) {
                var joceDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  joceDb.push(results.rows.item(i))
                }
                $timeout(function(){
                  number = joceDb[0].number
                });
              }, null);
            });
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS jocex(id INTEGER PRIMARY KEY ASC, text TEXT, joceId TEXT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql("INSERT INTO jocex (text, joceId) VALUES (?,?)",[jocex.text, jocex.joceId], function (tx, results) {
              });
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM jocex WHERE joceId=?', [$stateParams.joceId], function (tx, results) {
              var jocexsDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  jocexsDb.push(results.rows.item(i))
                }
                $timeout(function(){
                  if (jocexsDb.length == number){
                    $location.path('/showJoce/'+$stateParams.joceId);
                  }
                  else{
                    console.log(jocexsDb.length, number)
                    $location.path('/home');
                  }
                });
              }, null);
            });
          };
          function getJocexs (){
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS jocex(id INTEGER PRIMARY KEY ASC, text TEXT, joceId TEXT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM jocex WHERE joceId=?', [$stateParams.joceId], function (tx, results) {
                var jocexsDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  jocexsDb.push(results.rows.item(i))
                }
                $timeout(function(){
                  if(jocexsDb[jocexsDb.length -1] === undefined){
                    var jdb = {text:"There isn't any jocex for this joce"};
                    $scope.lastestJocex = jdb;
                  }
                  else{
                    $scope.lastestJocex = jocexsDb[jocexsDb.length -1];
                  }
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
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, minumum INT, maximum INT)", []);
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
    .controller('editJoceController', ['$scope', '$location', '$timeout', '$stateParams',
        function($scope, $location, $timeout, $stateParams) {
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
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, minumum INT, maximum INT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql("INSERT INTO joce (name, number, time, minumum, maximum) VALUES (?,?,?,?,?)",[joce.name, joce.number, joce.time, joce.minumum, joce.maximum], function (tx, results) {
                $timeout(function(){
                  $location.path('/addJocex/'+results.insertId);
                });
              });
            });
          };
          $scope.remove = function () {
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, minumum INT, maximum INT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('DELETE FROM joce WHERE id = ?', [$stateParams.joceId]);
            });
            db.transaction(function (tx) {
              tx.executeSql('DELETE FROM jocex WHERE joceId = ?', [$stateParams.joceId]);
              $timeout(function(){
                $location.path('/home');
              });
            });
          };
          function getJoce(){
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name INT, number INT, time INT, minumum INT, maximum INT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM joce WHERE id=?', [$stateParams.joceId], function (tx, results) {
                var joceDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  joceDb.push(results.rows.item(i))
                }
                $timeout(function(){
                  $scope.joce = joceDb[0];
                });
              }, null);
            });
          };
          getJoce();
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
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, minumum INT, maximum INT)", []);
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

'use strict';

angular
    .module('core')
    .controller('showJoceController', ['$scope', '$location', '$stateParams', '$timeout',
        function($scope, $location, $stateParams, $timeout) {
          $scope.go = function (path) {
            $location.path(path);
          };
          function getJoces (){
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, minumum INT, maximum INT)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM jocex WHERE joceId=?', [$stateParams.joceId], function (tx, results) {
                var jocexsDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  jocexsDb.push(results.rows.item(i))
                }
                $timeout(function(){
                  $scope.jocexs = jocexsDb;
                });
              }, null);
            });
          };
          getJoces();
        }
    ]);
