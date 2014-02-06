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
  })
  .directive('mason', ['$window',
    function($window) {
      return {
        restrict: 'EA',
        priority: 0,
        link: function(scope, el) {

          var masonry = new $window.Masonry(el[0], {
            itemSelector: '.mason',
            columnWidth: '.mason',
            transitionDuration: '0.2s'
          });

          el.ready(function() {
            masonry.addItems([el]);
            masonry.reloadItems();
            masonry.layout();
          });

        }
      };
    }
  ]);
