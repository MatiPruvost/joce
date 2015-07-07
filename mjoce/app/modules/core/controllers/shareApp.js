'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('shareAppController', ['$scope', '$location', '$stateParams', '$timeout', '$cordovaSocialSharing',
        function($scope, $location, $stateParams, $timeout, $cordovaSocialSharing) {
          $scope.shareAnywhere = function() {
            $cordovaSocialSharing.share('You can download Joce here', null, null, 'http://www.google.com');
          }
        }
    ]);