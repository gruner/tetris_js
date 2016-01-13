'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['browserify', 'watch']);

  grunt.registerTask('build', [
    'clean',
    'browserify',
    'uglify',
    'copy'
  ]);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    browserify: {
      main: {
        src: 'js/main.js',
        dest: 'dist/js/tetris.js'
      }
    },
    
    watch: {
      files: 'js/*',
      tasks: ['default']
    },
    
    clean: {
      dist: ['dist']
    },

    copy: {
      'dist': {
        files: [
          {
            expand: true,
            cwd: '.',
            dest: 'dist',
            src: ['tetris.html']
          }
        ]
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'dist/js/tetris.js': ['dist/js/tetris.js']
        }
      }
    }

  });
}