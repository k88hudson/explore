module.exports = function (grunt) {

  grunt.initConfig({
    less: {
      development: {
        files: {
          'app/compiled/app.min.css': 'app/less/app.less'
        },
        options: {
          sourceMap: true
        }
      }
    },
    watch: {
      less: {
        files: ['app/less/**/*.less'],
        tasks: ['less:development']
      }
    },
    shell: {
      runServer: {
        options: {
          async: true
        },
        command: 'node server.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [ 'less', 'shell:runServer', 'watch']);


};
