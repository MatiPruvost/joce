'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('settingController', ['$scope', '$location', '$stateParams', '$timeout', '$translate',
        function($scope, $location, $stateParams, $timeout, $translate) {
          $scope.shareAnywhere = function() {
            $cordovaSocialSharing.share($translate.instant('settings.text'), null, null, 'http://www.google.com');
          }
        }
    ]);