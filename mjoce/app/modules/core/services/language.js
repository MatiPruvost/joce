'use strict';

/**
 * @ngdoc service
 * @name core.Services.Language
 * @description Language Service
 */
angular
  .module('core')
  .service('languageService', ['$cookies',
    function($cookies) {
      /**
       * @ngdoc function
       * @name core.Services.Language#method1
       * @methodOf core.Services.Language
       * @return {boolean} Returns a boolean value
       */
      this.getLanguage = function() {
        var languageCookies = $cookies.get('language');
        languageCookies = false;
        if(languageCookies){
          return languageCookies;
        }
        var navigatorLanguaje = window.navigator.language;
        navigatorLanguaje = navigatorLanguaje.substring(0, 2);
        switch (navigatorLanguaje) {
          case 'en':
            return 'en';
            break;
          case 'es':
            return 'es';
            break;
          default: 
            return 'en';
        }
      };
    }
  ]);
