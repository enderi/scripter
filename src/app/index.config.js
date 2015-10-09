(function() {
  'use strict';

  angular
    .module('scripter')
    .config(config)
    .config(indexedDbConfig);

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

  function indexedDbConfig($indexedDBProvider){
      $indexedDBProvider
        .connection('scriptDB')
        .upgradeDatabase(1, function(event, db, tx){
            var objStore = db.createObjectStore('script', {keyPath: 'id', autoIncrement: true});
            /*objStore.createIndex('id', {unique: true});
            objStore.createIndex('name', {unique: true});
            objStore.createIndex('description', {unique: false});
            objStore.createIndex('scriptMode', {unique: false});*/
        });
  }

})();
