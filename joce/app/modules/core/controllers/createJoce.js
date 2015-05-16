'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
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
              tx.executeSql("CREATE TABLE IF NOT EXISTS joce(id INTEGER PRIMARY KEY ASC, name TEXT, number TEXT, time TEXT, minumum TEXT, maximum TEXT)", []);
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