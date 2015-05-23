'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
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
                    jocesDb[i].disabled = true;
                  }
                  else if (now >= until){
                    jocesDb[i].updateable = true;
                    jocesDb[i].waiting = false;
                    jocesDb[i].url = "addJocex";
                    jocesDb[i].disabled = false;
                  }
                  else{
                    jocesDb[i].updateable = false;
                    jocesDb[i].waiting = true;
                    jocesDb[i].url = "addJocex";
                    jocesDb[i].disabled = false;                    
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
