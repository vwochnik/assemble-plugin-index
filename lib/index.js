/*
 * assemble-plugin-index
 * https://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Global dependencies
 */

var path = require('path');
var through2 = require('through2');
var clone = require('clone-deep');
var tutils = require('template-utils');
var gutil = require('gulp-util');
var _ = require('lodash');

/*
 * Local dependencies
 */

var Aggregator = require('./aggregator');
var Paginator = require('./paginator');
var render = require('./render');

module.exports = function(assemble) {
  // introduce renderable `index` template collection
  assemble.create('index', 'indices', {isRenderable: true});

  return function(index, options) {
    // buidl options object
    options = _.extend({limit: 10, aggregate: ''}, assemble.option('index'), options);

    // Get the template that was defined by the user in the options
    var template = assemble.views.indices[index];

    // generate default pattern (filename + :num: + ext)
    if (!_.has(options, 'pattern'))
      options.pattern = index + ':num:';

    // initialize helpers
    var aggregator = new Aggregator(options.aggregate);
    var paginator = new Paginator(options.pattern);

    return through2.obj(function(file, enc, cb) {
      aggregator.aggregate(file);
      this.push(file);
      cb();
    }, function(cb) {
      if (!template) {
        this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Index template does not exist.'));
        return cb();
      }

      var that = this;
      render(aggregator, paginator, template, options, function(err, file) {
        if (err) {
          that.emit('error', new gutil.PluginError('assemble-plugin-index', err));
          return cb(err);
        }

        if (!file)
          return cb();

        that.push(file);
      });
    });
  };
};
