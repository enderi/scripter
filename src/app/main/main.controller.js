(function() {
  'use strict';

  angular
    .module('scripter')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(
    $scope,
    categoryService,
    scriptService,
    $log,
    $mdDialog) {

    function addCategoryCtrl($scope, $mdDialog){
      $scope.add = function(){
        categoryService.add($scope.newCategory);
        init();
        $mdDialog.hide();
      }
    }

    $scope.addCategory = function($event){
      var confirm = $mdDialog.alert()
      .title('whaat')
      .content('hmm')
      .ok('Close');
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        controller: addCategoryCtrl,
        template:
          '<md-dialog aria-label="Add Category">' +
          '  <md-dialog-content>'+
          '    <md-input-container>' +
          '      <label>Name of new category:</label>' +
          '      <input name="category" ng-model="newCategory" required min-length="4" max-length="50">' +
          '    </md-input-container>' +
          '  </md-dialog-content>' +
          '  <div class="md-actions">' +
          '    <md-button ng-click="add()" class="md-primary">' +
          '      Add' +
          '    </md-button>' +
          '  </div>' +
          '</md-dialog>'
      });
    }

    function addScriptCtrl($scope, $mdDialog, category){
      $scope.add = function(){
        scriptService.add($scope.newScript, category, 'Description');
        init();
        $mdDialog.hide();
      }
    }

    $scope.addScript = function($event){
      var confirm = $mdDialog.alert()
      .title('whaat')
      .content('hmm')
      .ok('Close');
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        controller: addScriptCtrl,
        locals: {
          category: $scope.selectedCategory
        },
        template:
          '<md-dialog aria-label="Add Category">' +
          '  <md-dialog-content>'+
          '    <md-input-container>' +
          ' {{category.name}}'+
          '      <label>Name of new script:</label>' +
          '      <input name="category" ng-model="newScript" required min-length="4" max-length="50">' +
          '    </md-input-container>' +
          '  </md-dialog-content>' +
          '  <div class="md-actions">' +
          '    <md-button ng-click="add()" class="md-primary">' +
          '      Add' +
          '    </md-button>' +
          '  </div>' +
          '</md-dialog>'
      });
    }

    $scope.clearData = function(){
      categoryService.clear();
      scriptService.clear();
      init();
    }

    function init(){
      $scope.categories = categoryService.get();
      $scope.scripts = scriptService.get();
    }

    init();
  }
})();
