(function() {
  'use strict';

  angular
    .module('scripter')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
