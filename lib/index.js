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

var through2 = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');

/*
 * Local dependencies
 */

var Paginator = require('./paginator');
var render = require('./render');
var filter = require('./util/filter');

module.exports = function(assemble) {
  // introduce renderable `index` template collection
  assemble.create('index', 'indices', {isRenderable: true});

  return function(index, options) {
    // buidl options object
    options = _.extend({limit: 10, filter: undefined}, assemble.option('index'), options);

    // Get the template that was defined by the user in the options
    var template = assemble.views.indices[index];

    // generate default pattern (filename + :num: + ext)
    if (!_.has(options, 'pattern'))
      options.pattern = index + ':num:';

    // initialize helpers
    var filterFunc = filter(options.filter);

    var items = [];
    return through2.obj(function(file, enc, cb) {
      if (_.isUndefined(filterFunc)) {
        this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Invalid filter option.'));
        return cb();
      }

      var filtered = filterFunc(file.data);
      if (filtered)
        items.push(_.extend({url: file.relative}, filtered));

      this.push(file);
      cb();
    }, function(cb) {
      if (!template) {
        this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Index template does not exist.'));
        return cb();
      }

      var that = this;
      var paginator = new Paginator(options.pattern);
      render(items, paginator, template, options, function(err, file) {
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
