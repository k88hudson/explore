'use strict';

angular
  .module('exploreApp.services', [])
  .factory('makeapi', ['$q', 'SERVICE',
    function($q, SERVICE) {

      var makeapi = new Make({
        apiURL: SERVICE.makeapiUrl
      });

      return {
        makeapi: makeapi,
        tags: function(tags, callback) {
          var deferred = $q.defer();
          makeapi
            .find({
              tags: [{tags: tags}]
            })
            .then(function(err, makes) {
               if (err) {
                deferred.reject(err);
              } else {
                deferred.resolve(makes);
              }
            });
          return deferred.promise;
        }
      };

    }
  ]);
