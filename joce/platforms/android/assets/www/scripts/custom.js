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
    .module('core', ['ngCordova'])
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
            var date = new Date(new Date().toUTCString());
            date = date.toISOString();
            var joceDb = [];
            var jocex = {
              text:$scope.jocex,
              joceId:$stateParams.joceId,
              timeStamp: date
            };
            var number = null;
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM joce WHERE id=?', [$stateParams.joceId], function (tx, results) {
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  joceDb.push(results.rows.item(i))
                }
                $timeout(function(){
                  number = joceDb[0].number;
                });
              }, null);
            });
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS jocex(id INTEGER PRIMARY KEY ASC, text TEXT, joceId TEXT, timeStamp TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql("INSERT INTO jocex (text, joceId, timeStamp) VALUES (?,?,?)",[jocex.text, jocex.joceId, jocex.timeStamp], function (tx, results) {
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
                    db.transaction(function (tx) {
                      tx.executeSql('UPDATE joce SET finished=? WHERE id=?', [true, $stateParams.joceId], function (tx, results) {
                      });
                    });
                    $location.path('/showJoce/'+$stateParams.joceId);
                  }
                  else{
                    $location.path('/home');
                    updateJoceUntil(joceDb[0], date);
                  }
                });
              }, null);
            });
          };
          function updateJoceUntil(joceDb, date){
            var until = new Date(date);
            until.setDate(until.getDate() + joceDb.time);
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('UPDATE joce SET until=? WHERE id=?', [until, $stateParams.joceId], function (tx, results) {
              });
            });
          };
          function getJocexs (){
            var timeNow = new Date(new Date().toUTCString());
            var time = null;
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
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
                  time = joceDb[0].time;
                });
              }, null);
            });
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS jocex(id INTEGER PRIMARY KEY ASC, text TEXT, joceId TEXT, timeStamp TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM jocex WHERE joceId=?', [$stateParams.joceId], function (tx, results) {
                var jocexsDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  jocexsDb.push(results.rows.item(i))
                }
                var lastestJocex = jocexsDb[jocexsDb.length -1];
                $timeout(function(){
                  if(lastestJocex === undefined){
                    var jdb = {text:"There aren't any jocex for this joce"};
                    $scope.lastestJocex = jdb;
                    $scope.disabled = false;
                  }
                  else{
                    var validTime = new Date(lastestJocex.timeStamp);
                    validTime.setDate(validTime.getDate() + time);
                    if(validTime > timeNow){
                      var validedTime = new Date(validTime);
                      var date = validedTime.toLocaleDateString();
                      var time_ = validedTime.toLocaleTimeString();
                      var text1 = "You need wait until the ";
                      var text2 = " at ";
                      var text = text1.concat(date, text2, time_);
                      $scope.disabled = true;
                      $scope.alertShow = true;
                      $scope.alerMessage = text;
                    }
                    else{
                      $scope.alertShow = false;
                      $scope.disabled = false;
                    }
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
              time:$scope.time
            };
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql("INSERT INTO joce (name, number, time) VALUES (?,?,?)",[joce.name, joce.number, joce.time], function (tx, results) {
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
              time:$scope.time
            };
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('UPDATE joce SET name=?, number=?, time=? WHERE id=?', [joce.name, joce.number, joce.time, $stateParams.joceId], function (tx, results) {
                $timeout(function(){
                  $location.path('/home');
                });
              });
            });
          };
          $scope.remove = function () {
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
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
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name INT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM joce WHERE id=?', [$stateParams.joceId], function (tx, results) {
                var joceDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  joceDb.push(results.rows.item(i))
                }
                $timeout(function(){
                  $scope.name = joceDb[0].name;
                  $scope.number = joceDb[0].number;
                  $scope.time = joceDb[0].time;
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
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM joce', [], function (tx, results) {
                /*var date = new Date(new Date().toUTCString());
                date = date.toISOString();*/
                var jocesDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  jocesDb.push(results.rows.item(i));
                  var now = new Date();
                  var until = new Date(jocesDb[i].until);
                  if (jocesDb[i].finished == "true"){
                    jocesDb[i].updateable = false;
                    jocesDb[i].waiting = false;
                    jocesDb[i].url = "showJoce";
                  }
                  else if (now >= until){
                    jocesDb[i].updateable = true;
                    jocesDb[i].waiting = false;
                    jocesDb[i].url = "addJocex";
                  }
                  else{
                    jocesDb[i].updateable = false;
                    jocesDb[i].waiting = true;
                    jocesDb[i].url = "addJocex";
                  }
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
    .controller('showJoceController', ['$scope', '$location', '$stateParams', '$timeout', '$cordovaSocialSharing',
        function($scope, $location, $stateParams, $timeout, $cordovaSocialSharing) {
          $scope.shareAnywhere = function() {
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS jocex(id INTEGER PRIMARY KEY ASC, text TEXT, joceId TEXT, timeStamp TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM jocex WHERE joceId=?', [$stateParams.joceId], function (tx, results) {
                var jocexsTextDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  jocexsTextDb.push(results.rows.item(i).text)
                }
                $timeout(function(){
                  var text = jocexsTextDb.join(" ");
                  $cordovaSocialSharing.share(text, "This is your joce finished");
                });
              }, null);
            });
          }
          $scope.go = function (path) {
            $location.path(path);
          };
          function getJoces (){
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS jocex(id INTEGER PRIMARY KEY ASC, text TEXT, joceId TEXT, timeStamp TIMESTAMP)", []);
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
