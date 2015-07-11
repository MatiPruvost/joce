'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('addJocexController', ['$scope', '$location', '$stateParams', '$timeout', '$mdDialog', '$translate',
        function($scope, $location, $stateParams, $timeout, $mdDialog, $translate) {
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
                    //Update to true
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
            //timeNow = timeNow.toISOString();
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
                    var jdb = {text:$translate.instant('addJocex.lastestJocex')};
                    $scope.lastestJocex = jdb;
                    $scope.disabled = false;
                  }
                  else{
                    var validTime = new Date(lastestJocex.timeStamp);
                    validTime.setDate(validTime.getDate() + time);
                    //validTime = validTime.toISOString();
                    if(validTime > timeNow){
                      var validedTime = new Date(validTime);
                      var date = validedTime.toLocaleDateString();
                      var time_ = validedTime.toLocaleTimeString();
                      var text1 = $translate.instant('addJocex.alert.text1');
                      var text2 = $translate.instant('addJocex.alert.text2');
                      var text = text1.concat(date, text2, time_);
                      $scope.disabled = true;
                      $scope.alertShow = true;
                      $scope.alerMessage = text;
                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element(document.body))
                          .title($translate.instant('addJocex.alert.title'))
                          .content(text)
                          .ariaLabel('Alert Dialog Demo')
                          .ok('Ok')
                          .targetEvent()
                      );
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