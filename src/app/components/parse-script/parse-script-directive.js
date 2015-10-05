(function() {
  'use strict';

  angular
    .module('scripter')
    .directive('parseScript', parseScript);

  /** @ngInject */
  function parseScript(malarkey) {
    var directive = {
      restrict: 'E',
      scope: {
        extraValues: '='
      },
      template: '&nbsp;',
      link: linkFunc,
    };

    return directive;

    function linkFunc(scope, el, attr, vm) {
      //console.log(scope, attr, vm);
      scope.$watch('script', function(newValue){
        //console.log('NEW: ', newValue);
      })
    }
  }

})();
