'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('editJoceController', ['$scope', 
      '$location', 
      '$timeout', 
      '$stateParams', 
      '$mdDialog', 
      '$translate',
        function($scope, 
          $location, 
          $timeout, 
          $stateParams, 
          $mdDialog, 
          $translate) {
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
                  if (joceDb[0].finished == "true"){
                    $scope.disabled = true;
                    $scope.alertShow = true;
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title($translate.instant('editJoce.alert.title'))
                        .content($translate.instant('editJoce.alert.text'))
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Ok')
                        .targetEvent()
                    );
                  }
                  else{
                    $scope.disabled = false;
                    $scope.alertShow = false;                    
                  }
                });
              }, null);
            });
          };
          getJoce();
        }
    ]);