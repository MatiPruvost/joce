'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('settingController', ['$scope', '$location', '$stateParams', '$timeout',
        function($scope, $location, $stateParams, $timeout) {
          $scope.shareAnywhere = function() {
            $cordovaSocialSharing.share('You can download Joce here', null, null, 'http://www.google.com');
          }
        }
    ]);