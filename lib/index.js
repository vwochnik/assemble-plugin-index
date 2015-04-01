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

//var organizer = require('./organizer');
var pagination = require('./pagination');

module.exports = function(assemble) {
  // option defaults
  var defaultOptions = {limit: 10};

  // introduce renderable `index` template collection
  assemble.create('index', 'indices', {isRenderable: true});

  return function(index, options) {
    // buidl options object
    options = _.extend({}, defaultOptions, assemble.option('index'), options);

    // Get the template that was defined by the user in the options
    var template = assemble.views.indices[index];

    // generate default pattern (filename + :num: + ext)
    if (!_.has(options, 'pattern')) {
      //TODO where get ext when template.extname is empty?
      // or is template.extname never empty since we're drawing from app.views.*.*?
      options.pattern = path.basename(template.path, template.ext||path.extname(template.path)) + ':num:';
    }

    // determine pattern with extension
    var pattern = options.pattern + template.ext;

    var items = [], page = pagination(pattern), locals = [];
    return through2.obj(function(file, enc, callback) {
      this.push(file);
      items.push(file.data);
      callback();
    }, function(cb) {
      if (!template) {
        this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Index template does not exist.'));
        return cb();
      }

      // this is subject to improvement
      do {
        var local = { items: [], pagination: page() };
        while ((local.items.length < options.limit) && (items.length > 0))
          local.items.push(items.splice(-1,1)[0]);
        locals.push(local);
      } while (items.length > 0);

      // render and push onto stream recursively
      var that = this, worker;
      (worker = function() {
        if (locals.length === 0)
          return cb();

        var local = locals.pop();

        var tmpl = clone(template);
        tmpl.path = local.pagination.current;
        tmpl.data = _.extend({}, local);
        tutils.parsePath(tmpl);
        tmpl.render(function(err) {
          if (err) {
            stream.emit('error', new gutil.PluginError('assemble-plugin-index', err));
            return cb(err);
          }

          that.push(tutils.toVinyl(tmpl));
          worker();
        });
      })();
    });
  };
};
