/*
 * assemble-plugin-index
 * hhttps://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'index.js', 'lib/*.js', 'lib/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['test/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // By default, lint and generate readme.
  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
