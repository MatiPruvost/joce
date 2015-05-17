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