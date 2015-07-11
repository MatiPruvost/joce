'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('shareAppController', ['$scope', 
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
            $cordovaSocialSharing.share($translate.instant('shareApp.text'), null, null, 'http://www.google.com');
          }
        }
    ]);