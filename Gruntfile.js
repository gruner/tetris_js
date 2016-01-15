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

  // grunt.registerTask('buildDebug', function() {
  //   var tasks = ['build'];

  //   if (grunt.option('debug')) {
  //     tasks.append('browserify:debug');
  //   }

  //   grunt.task.run(tasks);
  // });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    browserify: {
      main: {
        src: 'js/main.js',
        dest: 'dist/js/tetris.js'
      },
      debug: {
        src: 'js/main.js',
        dest: 'dist/js/tetris.debug.js'
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
          'dist/js/tetris.min.js': ['dist/js/tetris.js']
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