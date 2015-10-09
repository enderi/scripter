(function() {
  'use strict';

  angular
    .module('scripter')
    .factory('scriptPersistService', scriptPersistService);

  /** @ngInject */
  function scriptPersistService($log, $q, $indexedDB) {
    var scriptLocalStorageKey = 'scripts';
    var dbKey = 'script';

    function openStore(fn) {
      return $indexedDB.openStore(dbKey, fn);
    }

    var cachedScripts = null;

    var service = {
      get: function(id) {
        if (!id) {
          return openStore(function(store) {
            return store.getAll()
              .then(function(data) {
                cachedScripts = data;
                return data;
              });
          });
        } else {
          var deferred = $q.defer();
          var item = _.find(cachedScripts, {
            id: +id
          });
          if (item) {
            deferred.resolve(item);
          } else {
            deferred.reject();
          }
          return deferred.promise;
        }
      },
      save: function(script) {
        return openStore(function(store) {
          return store.upsert(script);
        });
      },
      delete: function() {}
    };

    return service;
  }
})();
