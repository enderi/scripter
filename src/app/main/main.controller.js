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
    };

    $scope.isScriptOk = function() {
      return $scope.script && $scope.script.name && $scope.script.code;
    };

    $scope.saveScript = function() {
      scriptPersistService.save($scope.script);

      init();
    };

    $scope.clearScript = function() {
      $scope.selectedScript = null;
      $scope.script = null;

      $scope.variableValues = null;
      init();
    }

    $scope.$watch('selectedScript', function(newValue) {
      $scope.script = _.find($scope.scripts, {
        id: newValue
      });
    });

    $scope.$watch('script', function(newValue) {
      if (newValue) {
        scriptParser.getVariables(newValue.code)
          .then(function(variables) {
            $scope.variables = variables;
            return variables;
          })
          .then(replaceVariables);

      }else{
          $scope.variables = null;
          $scope.fullScript = null;
      }
    }, true);

    function replaceVariables() {
      scriptParser.replaceVariables(
          $scope.script.code,
          $scope.variableValues
        )
        .then(function(data) {
          $scope.fullScript = data;
        });
    }

    $scope.$watch('variableValues', function(newValue, oldValue) {
      if (!_.isEmpty(newValue)) {
        replaceVariables();
      }
    }, true);

    $scope.aceLoaded = function(_editor) {
      $log.log(_editor);
    };

    $scope.aceOption = {
      mode: ($scope.script && $scope.script.scriptMode || '').toLowerCase(),
      onLoad: function(_ace) {

        // HACK to have the ace instance in the scope...
        $scope.modeChanged = function() {
          if ($scope.script && $scope.script.scriptMode) {
            _ace.getSession().setMode("ace/mode/" + $scope.script.scriptMode.toLowerCase());
          }
        };
        _ace.$blockScrolling = Infinity;
      }
    };

    function init() {
      scriptPersistService.get()
        .then(function(all) {
          $scope.scripts = all;
        });
    }

    init();
  }
})();
