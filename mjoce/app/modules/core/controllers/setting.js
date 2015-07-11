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
        function($scope, 
          $location, 
          $stateParams, 
          $timeout, 
          $translate, 
          $cookies) {
          getLanguage();
          $scope.submit = function (){
            $cookies.put('language', $scope.data.language);
          }
          function getLanguage() {
            var navigatorLanguaje = window.navigator.language;
            navigatorLanguaje = navigatorLanguaje.substring(0, 2);
            switch (navigatorLanguaje) {
              case 'en':
                $scope.data = {
                  language : 'en'
                };
                break;
              case 'es':
                $scope.data = {
                  language : 'es'
                };
                break;
              default: 
                $scope.data = {
                  language : 'en'
                };
            }
          };
        }
    ]);