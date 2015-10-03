(function() {
  'use strict';

  angular
    .module('scripter')
    .directive('parseScript', parseScript);

  /** @ngInject */
  function parseScript(script, variables) {
    $log.log(script, variables);

    return {
      restrict: 'E',
      scope: {
      },
      link: function(a, b, c){
        console.log(a, b, c);
      },
      controllerAs: 'vm'
    };
  }

})();
