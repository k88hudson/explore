'use strict';

angular.module('exploreApp', ['ngRoute', 'slugifier', 'ui.bootstrap'])
  .constant('SERVICE', {
    url: 'http://c-directory-service.herokuapp.com'
    //url: 'http://localhost:7878'
  })
  .constant('SITE', {
    skills: [{
      name: 'Navigation',
      colour: '#ff4e1f',
      description: 'Using software tools to browse the web'
    }, {
      name: 'Web Mechanics',
      colour: '#ff6969',
      description: 'Some bullshit bullshit'
    }, {
      name: 'Search',
      colour: '#fe4040'
    }, {
      name: 'Credibility',
      colour: '#ff5984'
    }, {
      name: 'Security',
      colour: '#ff004e'
    }, {
      name: 'Composing for the web',
      colour: '#01bc85'
    }, {
      name: 'Remixing',
      colour: '#00ceb8'
    }, {
      name: 'Design and Accessibility',
      colour: '#6ecba9'
    }, {
      name: 'Coding and scripting',
      colour: '#00967f'
    }, {
      name: 'Infrastructure',
      colour: '#09b773'
    }, {
      name: 'Sharing and Collaborating',
      colour: '#739ab1'
    }, {
      name: 'Community Participation',
      colour: '#63cfea'
    }, {
      name: 'Privacy',
      colour: '#00bad6'
    }, {
      name: 'Open Practices',
      colour: '#0097d6'
    }]
  })
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainController'
      })
      .when('/competencies/:id', {
        templateUrl: 'views/competency.html',
        controller: 'competencyController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .factory('authInterceptor', function($rootScope, $q, $window) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if ($rootScope.user) {
          config.headers.Authorization = 'Bearer ' + $rootScope.user.token;
        }
        return config;
      },
      response: function(response) {
        if (response.status === 401) {
          response.data = 'There was a problem with the authentication token -- maybe you are not signed in?';
        }
        return response || $q.when(response);
      }
    };
  })
  .factory('personaService', ['$http', '$q', '$rootScope', '$location', '$window', 'SERVICE',
    function personaService($http, $q, $rootScope, $location, $window, SERVICE) {

      // Restore user state from local storage.
      $rootScope.user = $window.localStorage.user ? angular.fromJson($window.localStorage.user) : {};

      // Update local storage on changes to _user object.
      $rootScope.$watch('user', function() {
        if ($rootScope.user) {
          $window.localStorage.user = angular.toJson($rootScope.user);
        } else {
          delete $window.localStorage.user;
        }
      });

      if (!navigator.id) {
        $rootScope.login = function() {};
        $rootScope.logout = function() {};
        $rootScope.user = {};
        // No persona available
        console.error('No persona available.');
        return;
      }

      // Set up login/logout functions
      $rootScope.login = function() {
        navigator.id.request();
      };
      $rootScope.logout = function() {
        navigator.id.logout();
        $rootScope.user = {};
      };

      navigator.id.watch({
        loggedInUser: null,
        onlogin: function(assertion) {
          var deferred = $q.defer();
          var audience = window.location.origin;

          $http
            .post(SERVICE.url + '/auth', {
              audience: audience,
              assertion: assertion
            })
            .then(function(response) {
              if (response.status !== 200) {
                deferred.reject(response.data);
              } else {
                deferred.resolve(response.data);
              }
            });

          deferred.promise.then(function(data) {
            $rootScope.user = data;

          }, function(err) {
            navigator.id.logout();
            console.log(err);
          });
        },
        onlogout: function() {
          $rootScope.user = {};
          $rootScope.$apply();
        }
      });

      return {};
    }
  ])
  .run(['$rootScope',
    function ($rootScope) {
      $rootScope.$on('$locationChangeSuccess', function (event) {
        document.querySelector('[ng-view]').scrollTo(0, 0);
      });
    }
  ]);
