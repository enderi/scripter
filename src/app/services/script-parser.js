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
      var builtScript = replaceAllScripts(script);
      return builtScript
        .then(function(fullScript) {
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
      var parsedScript = replaceAllScripts(script);
      return parsedScript.then(function(newScript) {
        _.each(variables, function(variable, key) {
          if (!_.isEmpty(variable)) {
            var regExp = new RegExp('#{var:' + key + '}', 'g');
            newScript = newScript.replace(regExp, variable);
          }
        });
        return newScript;
      });
    }

    function replaceEmbeddedScript(script, emb) {
      var regExp = new RegExp('#{script:' + emb.id + '}', 'g');
      return script.replace(regExp, emb.code);
    }

    function replaceAllScripts(script) {
      var deferred = $q.defer();
      replaceScriptsRecursively(script, parseEmbeddedScripts(script))
        .then(function(data) {
          deferred.resolve(data);
        });

      return deferred.promise;
    }

    function replaceScriptsRecursively(script, includedScripts) {
      if (_.isEmpty(includedScripts)) {
        return _createResolved(script);
      }

      return replaceScripts(script, includedScripts)
        .then(function(newScript) {
          return replaceScriptsRecursively(
            newScript,
            parseEmbeddedScripts(script));
        });
    }

    function replaceScripts(script, foundScriptIds) {
      var scriptPromises = [];
      _.each(foundScriptIds, function(scriptId) {
        scriptPromises.push(scriptPersistService.get(scriptId));
      });
      if (_.isEmpty(scriptPromises)) {
        return _createResolved(script);
      } else {
        return $q.all(scriptPromises).then(function(embeddedScripts) {
          _.each(embeddedScripts, function(emb) {
            script = replaceEmbeddedScript(script, emb);
          });
          return script;
        });
      }
    }


    var service = {
      getVariables: parseVariables,
      replaceVariables: replaceVariables,
      replaceScripts: replaceAllScripts
    };

    return service;
  }
})();
