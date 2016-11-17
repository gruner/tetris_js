'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['build', 'watch:js']);

  grunt.registerTask('build', [
    'clean',
    'browserify:main',
    'uglify',
    'copy'
  ]);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    browserify: {
      main: {
        src: 'js/main.js',
        dest: 'release/js/tetris.js'
      },
      debug: {
        src: 'js/main.js',
        dest: 'release/js/tetris.debug.js'
      }
    },
    
    watch: {
      js: {
        files: 'js/**/*.js',
        tasks: ['build', 'mochaTest']
      },
      ci: {
        files: ['js/**/*.js', 'test/**/*.js'],
        tasks: ['mochaTest']
      }
    },
    
    clean: {
      release: ['release']
    },

    copy: {
      'release': {
        files: [
          {
            expand: true,
            cwd: '.',
            dest: 'release',
            src: ['tetris.html', 'sounds/*.mp3']
          }
        ]
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      release: {
        files: {
          'release/js/tetris.min.js': ['release/js/tetris.js']
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['test/**/*.js']
      }
    }

  });
}