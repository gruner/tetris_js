/*jshint node:true*/

'use strict';
module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('./package.json'),
      path = require('path');

  require('load-grunt-config')(grunt, {
    config: {
      pkg: pkg,

      path: {
        cwd: path.resolve(),
        src: {
          cwd: './js'
        },
        dist: {
          cwd: './dist'
        }
      },
      pattern: {
        all: '**',
        js: '*.js',
        css: '*.css',
        html: '*.html',
      }
    }
  });

  grunt.registerTask('default', [
    'build',
  ]);

  grunt.registerTask('build', 'Downloads all dependencies and copies them along with src directory into dist directory', [
    'clean',
    'browserfy',
    'copy:dist',
  ]);
};
