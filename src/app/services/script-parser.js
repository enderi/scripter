(function() {
  'use strict';

  angular
    .module('scripter')
    .factory('scriptParser', scriptParser);

  function parseVariables(script) {
    var splittedTags = getTags(script);
    var variables = [];
    _.each(splittedTags, function(tag) {
      if (tag[0] === 'var' && tag.length === 2) {
        if (!_.contains(variables, tag[1])) {
          variables.push(tag[1]);
        }
      }
    });
    return variables;
  }

  function parseScript() {

  }

  function getTags(script) {
    var tagIndexes = getStartAndEndTags(script);
    return _.map(tagIndexes, function(tag) {
      var textInTag = script.substr(tag.textStart, tag.textEnd - tag.textStart);
      return textInTag.split(':');
    });
  }

  function getStartAndEndTags(script) {
    if (!script) {
      return;
    }
    var startTag = '#{';
    var endTag = '}';
    var tags = [];
    var openTags = [];

    for (var i = 0; i < script.length; i++) {
      if (script.substring(i, i + startTag.length) === startTag) {
        openTags.push({
          start: i,
          textStart: i + startTag.length,
          end: null,
          textEnd: null
        });
      } else if (script.substring(i, i + endTag.length) === endTag) {
        var currentlyOpen = openTags.pop();
        if (currentlyOpen) {
          currentlyOpen.end = i + endTag.length;
          currentlyOpen.textEnd = i;
          tags.push(currentlyOpen);
        }
      }
    }
    return tags;
  }

  function replaceVariables(script, variables) {
    var newScript = script;
    _.each(variables, function(variable, key) {
      var regExp = new RegExp('#{var:' + key + '}', 'g');
      newScript = newScript.replace(regExp, variable);
    });
    return newScript;
  }


  /** @ngInject */
  function scriptParser() {
    var service = {
      getVariables: parseVariables,
      buildScript: parseScript,
      replaceVariables: replaceVariables
    };

    return service;
  }
})();
