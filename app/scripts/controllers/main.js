'use strict';

angular.module('exploreApp')
  .controller('navigationController', function ($scope, $location, $routeParams, personaService, Slug, SITE) {
    $scope.isCollapsed = true;
    $scope.skills = SITE.skills;

    $scope.isActive = function (skill) {
      return Slug.slugify(skill) === $routeParams.id;
    };

    $scope.isUnselected = function () {
      return window.location.hash === '#/';
    }
  })
  .controller('mainController', function ($scope) {

  })
  .controller('competencyController', function ($scope, $location, $routeParams, Slug, SITE) {
    $scope.skill = SITE.skills.filter(function (item) {
      return Slug.slugify(item.name) === $routeParams.id;
    })[0];
  })
  .controller('eventsController', function ($scope) {
    //blah
  });
