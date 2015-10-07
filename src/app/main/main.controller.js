(function() {
  'use strict';

  angular
    .module('scripter')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(
    $scope,
    scriptParser,
    categoryService,
    scriptPersistService,
    $log) {

    $scope.variableValues = {};
    $scope.scriptModes = ['SQL', 'JSON', 'javascript', 'HTML']

    $scope.clearData = function() {
      categoryService.clear();
      init();
    }

    $scope.isScriptOk = function() {
      return $scope.script && $scope.script.name && $scope.script.code;
    }

    $scope.saveScript = function() {
      scriptPersistService.add($scope.script.name, $scope.script.code, 'category', 'description');
      init();
    }

    $scope.$watch('selectedScript', function(newValue) {
      $scope.script = newValue;
    });

    $scope.$watch('script', function(newValue) {
      if (newValue) {
        $scope.variables = scriptParser.getVariables(newValue.code);
        $scope.fullScript = scriptParser.replaceVariables(
          $scope.script.code,
          $scope.variableValues);
      }
    }, true);
    $scope.$watch('variableValues', function(newValue, oldValue) {
      if (!_.isEmpty(newValue)) {
        $scope.fullScript = scriptParser.replaceVariables($scope.script.code, newValue);
      }
    }, true);

    $scope.aceLoaded = function(_editor) {
      $log.log(_editor);
    };

    $scope.aceOption = {
      mode: ($scope.scriptMode || '').toLowerCase(),
      onLoad: function(_ace) {

        // HACK to have the ace instance in the scope...
        $scope.modeChanged = function() {
          _ace.getSession().setMode("ace/mode/" + $scope.scriptMode.toLowerCase());
        };
      }
    };

    function init() {
      //$scope.categories = categoryService.get();
      $scope.scripts = scriptPersistService.get();
      $scope.script = {
        code: 'copy #{var:mistä} #{var:mihin}',
        name: 'Select'
      };
    }

    init();
  }
})();
