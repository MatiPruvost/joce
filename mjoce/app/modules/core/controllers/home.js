'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeController', ['$scope', 
      '$location', 
      '$timeout', 
      '$mdSidenav', 
      '$mdUtil',
      '$mdToast', 
      '$translate',
      '$mdDialog',
        function($scope, 
          $location, 
          $timeout, 
          $mdSidenav, 
          $mdUtil, 
          $mdToast, 
          $translate,
          $mdDialog) {
          $scope.showUpdateableToast = function() {
            $mdToast.show(
              $mdToast.simple()
                .content($translate.instant('home.toasts.ready'))
                .position('bottom right')
                .hideDelay(3000)
            );
          };
          $scope.showWaitToast = function() {
            $mdToast.show(
              $mdToast.simple()
                .content($translate.instant('home.toasts.waiting'))
                .position('bottom right')
                .hideDelay(3000)
            );
          };
          $scope.showFinishedToast = function() {
            $mdToast.show(
              $mdToast.simple()
                .content($translate.instant('home.toasts.finished'))
                .position('bottom right')
                .hideDelay(3000)
            );
          };
          $scope.toggleLeft = buildToggler('left');
          function buildToggler(navID) {
            var debounceFn =  $mdUtil.debounce(function(){
                  $mdSidenav(navID)
                    .toggle();
                },300);
            return debounceFn;
          }
          $scope.go = function (path) {
            $mdSidenav('left').close();
            $location.path(path);
          };
          $scope.remove = function (id, index) {
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('DELETE FROM joce WHERE id = ?', [id]);
            });
            db.transaction(function (tx) {
              tx.executeSql('DELETE FROM jocex WHERE joceId = ?', [id]);
            });
            $scope.joces.splice(index, 1);
          };
          function getJoces (){
            var dbSize = 5 * 1024 * 1024; // 5Mb
            var db = window.openDatabase("joceTest", "1.0", "Joce Test DB", dbSize);
            db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number INT, time INT, finished TEXT DEFAULT 'false', until TIMESTAMP)", []);
            });
            db.transaction(function (tx) {
              tx.executeSql('SELECT * FROM joce', [], function (tx, results) {
                var jocesDb = [];
                var len = results.rows.length;
                for (var i = 0; i < len; i++) {
                  jocesDb.push(results.rows.item(i));
                  var now = new Date();
                  var until = new Date(jocesDb[i].until);
                  if (jocesDb[i].finished == "true"){
                    jocesDb[i].src = "img/icons/checkbox-marked-circle.svg";
                    jocesDb[i].click = "showFinishedToast(); $event.stopPropagation()";
                    jocesDb[i].url = "showJoce";
                    jocesDb[i].status = $translate.instant('home.menu.status.finished');
                  }
                  else if (now >= until){
                    jocesDb[i].src = "img/icons/plus-circle-outline.svg";
                    jocesDb[i].click = "showUpdateableToast(); $event.stopPropagation()";
                    jocesDb[i].url = "addJocex";
                    jocesDb[i].status = $translate.instant('home.menu.status.ready');
                  }
                  else{
                    jocesDb[i].src = "img/icons/clock.svg";
                    jocesDb[i].click = "showWaitToast(); $event.stopPropagation()";
                    jocesDb[i].url = "addJocex";
                    jocesDb[i].status = $translate.instant('home.menu.status.waiting');
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
