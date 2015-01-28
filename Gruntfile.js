module.exports = function(grunt) {
  grunt.initConfig({
    cssmin: {
      minify: {
        files: {
          'css/minesweeper.min.css':'css/minesweeper.css'
        }
      }
    },
    compass: {
      compile: {
        options: {
          config: 'config.rb'
        }
      }
    },
    watch: {
      css: {
        files: ['css/minesweeper.css'],
        tasks: ['cssmin']
      },
      scss: {
        files: ['sass/minesweeper.scss'],
        tasks: ['compass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.registerTask('default', 'watch');
};