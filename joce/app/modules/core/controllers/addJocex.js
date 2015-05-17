'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
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
                    console.log(jocexsDb[jocexsDb.length -1])
                    $scope.lastestJocex = jocexsDb[jocexsDb.length -1];
                  }
                });
              }, null);
            });
          };
          getJocexs();
        }
    ]);