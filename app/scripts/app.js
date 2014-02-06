'use strict';

angular.module('exploreApp', ['ngRoute', 'slugifier', 'ui.bootstrap', 'exploreApp.services'])
  .constant('SERVICE', {
    url: 'http://c-directory-service.herokuapp.com',
    makeapiUrl: 'https://makeapi.webmaker.org'
  })
  .constant('SITE', {
    skills: [{
      name: 'Navigation',
      colour: '#ff4e1f',
      description: 'Using software tools to browse the web'
    }, {
      name: 'Web Mechanics',
      colour: '#ff6969',
      description: 'Understanding the web ecosystem'
    }, {
      name: 'Search',
      colour: '#fe4040',
      description: 'Locating information, people and resources via the web'
    }, {
      name: 'Credibility',
      colour: '#ff5984',
      description: 'Critically evaluating information found on the web'
    }, {
      name: 'Security',
      colour: '#ff004e',
      description: 'Keeping systems, identities, and content safe'
    }, {
      name: 'Composing for the web',
      colour: '#01bc85',
      description: 'Creating and curating content for the web'
    }, {
      name: 'Remixing',
      colour: '#00ceb8',
      description: 'Modifying existing web resources to create something new'
    }, {
      name: 'Design and Accessibility',
      colour: '#6ecba9',
      description: 'Creating universally effective communications through web resources'
    }, {
      name: 'Coding and scripting',
      colour: '#00967f',
      description: 'Creating interactive experiences on the web'
    }, {
      name: 'Infrastructure',
      colour: '#09b773',
      description: 'Understanding the Internet stack'
    }, {
      name: 'Sharing and Collaborating',
      colour: '#739ab1',
      description: 'Jointly creating and providing access to web resources'
    }, {
      name: 'Community Participation',
      colour: '#63cfea',
      description: 'Getting involved in web communities and understanding their practices'
    }, {
      name: 'Privacy',
      colour: '#00bad6',
      description: 'Examining the consequences of sharing data online'
    }, {
      name: 'Open Practices',
      colour: '#0097d6',
      description: 'Helping to keep the web democratic and universally accessible'
    }],
    kits: {
      'navigation': [{
        title: 'What is a URL?',
        description: 'An introduction to the structure of URLs and finding resources on the well',
        author: '@secretrobotron',
        authorUrl: 'https://twitter.com/secretrobotron'
      }, {
        title: 'Finding and using links',
        description: 'Find links on a web page using Watson and learn how to evaluate them',
        author: '@secretrobotron',
        authorUrl: 'https://twitter.com/secretrobotron'
      }]
    },
    mentors: [
      {
        name: 'Brett Gaylor',
        avatar: 'img/brett.jpg',
        title: 'Director of Webmaker, Filmmaker',
        handle: '@brett'
      },
      {
        name: 'Laura Hilliger',
        avatar: 'img/laura.jpg',
        title: 'Curriculum Lead, Webmaker',
        handle: '@epilepticrabbit'
      },
      {
        name: 'Gavin Suntop',
        avatar: 'img/gvn.jpg',
        gif: 'https://wmprofile-service-production.s3.amazonaws.com/gifs/ZAGFs14aDMiCRhICFSKqF7ft.gif',
        title: 'Code dude',
        handle: '@gvn'
      }
    ]
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
      .when('/add', {
        templateUrl: 'views/add.html',
        controller: 'addController'
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
    function($rootScope) {
      $rootScope.$on('$locationChangeSuccess', function(event) {
        var ngView = document.querySelector('[ng-view]');
        if (ngView) {
          ngView.scrollTop = 0;
        }
      });
    }
  ]);
