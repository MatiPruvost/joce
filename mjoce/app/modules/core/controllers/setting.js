'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('settingController', ['$scope', 
      '$location', 
      '$stateParams', 
      '$timeout', 
      '$translate', 
      '$cookies',
      'languageService',
        function($scope, 
          $location, 
          $stateParams, 
          $timeout, 
          $translate, 
          $cookies,
          languageService) {
          $scope.data = {
            language : languageService.getLanguage()
          };
          $scope.submit = function (){
            $cookies.put('language', $scope.data.language);
            $translate.use($scope.data.language);
          }
        }
    ]);