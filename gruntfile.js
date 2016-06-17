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
              files: ['sass/*'],
              tasks: ['sass'],
              options: {
                  spawn: false,
              },
          },
      },
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['sass']);
};