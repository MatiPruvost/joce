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
          $scope.createWimyButton=false;
          $scope.$on('$destroy', function( event ) {
            $scope.createWimyButton=true;
            console.log("JSA")
            console.log($scope.createWimyButton)
          });
          $scope.showUpdateableToast = function(id) {
            var confirm = $mdDialog.confirm()
              .parent(angular.element(document.body))
              .title($translate.instant('home.alerts.ready.title'))
              .content($translate.instant('home.alerts.ready.content'))
              .ok($translate.instant('home.alerts.ready.ok'))
              .cancel($translate.instant('home.alerts.ready.cancel'))
              .targetEvent();
            $mdDialog.show(confirm).then(function() {
              $location.path("/addJocex/"+id);
            });
          };
          $scope.showWaitToast = function() {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title($translate.instant('home.alerts.waiting.title'))
                .content($translate.instant('home.alerts.waiting.content'))
                .ok($translate.instant('home.alerts.waiting.ok'))
                .targetEvent()
            );
          };
          $scope.showFinishedToast = function(id) {
            var confirm = $mdDialog.confirm()
              .parent(angular.element(document.body))
              .title($translate.instant('home.alerts.finished.title'))
              .content($translate.instant('home.alerts.finished.content'))
              .ok($translate.instant('home.alerts.finished.ok'))
              .cancel($translate.instant('home.alerts.finished.cancel'))
              .targetEvent();
            $mdDialog.show(confirm).then(function() {
              $location.path("/showJoce/"+id);
            });
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
                    jocesDb[i].click = "showFinishedToast("+jocesDb[i].id+")";
                    jocesDb[i].stopPropagation = "$event.stopPropagation()";
                    jocesDb[i].url = "showJoce";
                    jocesDb[i].status = $translate.instant('home.menu.status.finished');
                  }
                  else if (now >= until){
                    jocesDb[i].src = "img/icons/plus-circle-outline.svg";
                    jocesDb[i].click = "showUpdateableToast("+jocesDb[i].id+"); $event.stopPropagation()";
                    jocesDb[i].url = "addJocex";
                    jocesDb[i].status = $translate.instant('home.menu.status.ready');
                  }
                  else{
                    jocesDb[i].src = "img/icons/clock.svg";
                    jocesDb[i].click = "showWaitToast("+jocesDb[i].id+"); $event.stopPropagation()";
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
