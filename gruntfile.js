module.exports = function(grunt) {
  grunt.initConfig({
      sass: {
          dist: {
              files: {
                  'static/css/style.css': 'sass/style.scss'
              }
          }
      },
      
      watch: {
          scripts: {
              files: ['sass/*', 'frontend/*'],
              tasks: ['sass', 'concat'],
              options: {
                  spawn: false,
              },
          },
      },
      
      concat: {
        options: {
          separator: '\n',
          banner: '\'use strict\'; (function() { \n',
          footer: '})();',
        },
        dist: {
          src: ['frontend/streamer.js', 'frontend/api.js', 'frontend/view.js', 'frontend/app.js', 'frontend/main.js'],
          dest: 'static/js/app.js',
        }
      }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['sass', 'concat']);
};