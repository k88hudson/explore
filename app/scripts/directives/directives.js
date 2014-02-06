angular
  .module('exploreApp')
  .directive('exShorten', function () {
    return {
      restrict: 'A',
      priority: 1,
      link: function (scope, element, attrs) {

        // Ok, this is still kind of weird, but better than a timeout
        //  for determining that the repeater has rendered its inner html content
        scope.$watch('$index', function (newValue, oldValue, scope) {
          var html = element.html();

          if (html.length > 500) {
            html = html.slice(0, 499);
            html += '... <br/><a href="#">Read more</a>';
            element.html(html);
          }
        });
      }
    };
  });
