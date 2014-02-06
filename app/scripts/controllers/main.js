'use strict';

angular
  .module('exploreApp')
  .controller('navigationController', function ($scope, $location, $routeParams, personaService, Slug, SITE) {
    $scope.isCollapsed = true;
    $scope.skills = SITE.skills;

    $scope.isActive = function (name) {
      if (name[0] === '/') {
        return name === $location.path();
      }
      return Slug.slugify(name) === $routeParams.id;
    };

    $scope.isUnselected = function () {
      return window.location.hash === '#/';
    };
  })
  .controller('mainController', function ($scope) {

  })
  .controller('competencyController', function ($scope, $location, $routeParams, Slug, SITE) {
    $scope.skill = SITE.skills.filter(function (item) {
      return Slug.slugify(item.name) === $routeParams.id;
    })[0];
  })
  .controller('eventsController', function ($scope) {
    var request = new XMLHttpRequest();

    request.open('GET', '/json/events-mock.json', true);

    request.onload = function (data) {
      data = JSON.parse(request.responseText);
      data = data.events;

      var startPoint = Math.floor(Math.random() * (data.length - 3));

      $scope.events = data.slice(startPoint, startPoint + 3);
      $scope.$apply();
    };

    request.onerror = function () {
      console.error('JSON fetch failed.');
    };

    request.send();

  })
  .controller('addController', function ($scope) {
    //blah
  });
