(function() {
  'use strict';

  angular
    .module('scripter')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, localStorageServiceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    localStorageServiceProvider.setPrefix('scripter');
  }

})();
