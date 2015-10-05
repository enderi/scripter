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
    $log,
    $mdDialog) {

    $scope.variableValues = {};
    function addCategoryCtrl($scope, $mdDialog){
      $scope.add = function(){
        categoryService.add($scope.newCategory);
        init();
        $mdDialog.hide();
      }
    }

    $scope.clearData = function(){
      categoryService.clear();
      scriptService.clear();
      init();
    }

    $scope.isScriptOk = function(){
      return $scope.script && $scope.script.name && $scope.script.code;
    }

    $scope.saveScript = function(){
      scriptPersistService.add($scope.script.name, $scope.script.code, 'category', 'description');
      init();
    }

    $scope.$watch('selectedScript', function(newValue){
      $scope.script = newValue;
    });

    $scope.$watch('script', function(newValue, oldValue){
      if(newValue){
        $scope.fullScript = scriptParser.buildScript(newValue.code);
        $scope.variables = scriptParser.getVariables(newValue.code);
      }
    }, true);
    $scope.$watch('variableValues', function(newValue, oldValue){
      if(!_.isEmpty(newValue)){
        console.log(newValue);
        $scope.fullScript = scriptParser.replaceVariables($scope.script.code, newValue);
      }
    }, true);

    function init(){
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
