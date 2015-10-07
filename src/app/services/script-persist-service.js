(function() {
  'use strict';

  angular
    .module('scripter')
    .factory('scriptPersistService', scriptPersistService);

  /** @ngInject */
  function scriptPersistService($log, localStorageService) {
    var scriptLocalStorageKey = 'scripts';

    var service = {
      get: function(category){
        var scripts = localStorageService.get(scriptLocalStorageKey);
        if(category){
          return _.filter(scripts, {categoryId: category.id});
        }else{
          return scripts;
        }
      },
      add: function(name, code, category, description){
        var scripts = this.get() || [], greatestIndex = 0;
        angular.forEach(scripts, function(script){
          if(greatestIndex < script.id){
            greatestIndex = script.id;
          }
        });
        scripts.push({
          name: name,
          id: greatestIndex + 1,
          code: code,
          categoryId: category.id,
          description: description
        });
        this.save(scripts);
      },
      save: function(scripts){
        localStorageService.set(scriptLocalStorageKey, scripts);
      },
      clear: function(){
        localStorageService.set(scriptLocalStorageKey, null);
      }
    };

    return service;
  }
})();
