(function() {
  'use strict';

  angular
    .module('scripter')
    .factory('scriptParser', scriptParser);

  /** @ngInject */
  function scriptParser($log, $q, _scriptPersistService_) {
    var scriptPersistService = _scriptPersistService_;

    function _createRejected() {
      var deferred = $q.defer();
      deferred.reject();
      return deferred.promise;
    }

    function _createResolved(data) {
      var deferred = $q.defer();
      deferred.resolve(data);
      return deferred.promise;
    }

    function parseVariables(script) {
      var builtScript = replaceScripts(script);
      return builtScript.then(function(fullScript) {

        var splittedTags = getTags(fullScript);
        var variables = [];

        _.each(splittedTags, function(tag) {
          if (tag[0] === 'var' && tag.length === 2) {
            if (!_.contains(variables, tag[1])) {
              variables.push(tag[1]);
            }
          }
        });
        return variables;
      });
    }

    function parseEmbeddedScripts(script) {
      var splittedTags = getTags(script);
      var scripts = [];

      _.each(splittedTags, function(tag) {
        if (tag[0] === 'script' && tag.length === 2) {
          if (!_.contains(scripts, tag[1])) {
            scripts.push(tag[1]);
          }
        }
      });
      return scripts;
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
      var parsedScript = replaceScripts(script);
      return parsedScript.then(function(newScript) {
        _.each(variables, function(variable, key) {
          var regExp = new RegExp('#{var:' + key + '}', 'g');
          newScript = newScript.replace(regExp, variable);
        });
        return newScript;
      });
    }

    function replaceEmbeddedScript(script, emb) {
      var regExp = new RegExp('#{script:' + emb.id + '}', 'g');
      return script.replace(regExp, emb.code);
    }

    function replaceScripts(script) {
      var includedScripts = parseEmbeddedScripts(script);
      var scriptPromises = [];
      _.each(includedScripts, function(scriptId) {
        var promise = scriptPersistService.get(scriptId);
        scriptPromises.push(promise);
      });
      return $q.all(scriptPromises)
        .then(function(embeddedScripts) {
          _.each(embeddedScripts, function(emb) {
            script = replaceEmbeddedScript(script, emb);
          });
          return script;
        });
    }


    var service = {
      getVariables: parseVariables,
      replaceVariables: replaceVariables,
      replaceScripts: replaceScripts
    };

    return service;
  }
})();
