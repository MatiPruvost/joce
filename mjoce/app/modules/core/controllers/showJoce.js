'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('showJoceController', ['$scope', 
      '$location', 
      '$stateParams', 
      '$timeout', 
      '$cordovaSocialSharing', 
      '$translate',
        function($scope, 
          $location, 
          $stateParams, 
          $timeout, 
          $cordovaSocialSharing, 
          $translate) {
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
                  var textList = [text, $translate.instant('showJoce.text')];
                  text = textList.join(", ");
                  $cordovaSocialSharing.share(text);
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
