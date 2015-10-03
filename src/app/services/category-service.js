(function() {
  'use strict';

  angular
    .module('scripter')
    .factory('categoryService', categoryService);

  /** @ngInject */
  function categoryService($log, localStorageService) {
    var categoryLocalStorageKey = 'categories';

    var service = {
      get: function(){
        var categories = localStorageService.get(categoryLocalStorageKey);

        return categories || [];
      },
      add: function(name){
        var categories = this.get() || [], greatestIndex = 0;
        angular.forEach(categories, function(category){
          if(greatestIndex < category.id){
            greatestIndex = category.id;
          }
        });
        categories.push({
          name: name,
          id: greatestIndex + 1
        });
        this.save(categories);
      },
      save: function(categories){
        localStorageService.set(categoryLocalStorageKey, categories);
      },
      clear: function(){
        localStorageService.set(categoryLocalStorageKey, null);
      }
    };

    return service;
  }
})();
