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
var clone = require('clone-deep');
var File = require('vinyl');
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

    // generate default pattern
    //TODO use template.path + template.ext instead
    if (!_.has(options, 'pattern')) options.pattern = template.data.src.name+':num:'+template.data.src.extname;

    var items = [], page = pagination(options.pattern), locals = [];
    return through2.obj(function(file, enc, callback) {
      this.push(file);
      items.push(file.data);
      callback();
    }, function(cb) {
      if (!template) {
        this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Index template does not exist.'));
        return cb();
      }

      do {
        var local = { items: [], page: page() };
        while ((local.items.length < options.limit) && (items.length > 0))
          local.items.push(items.splice(-1,1)[0]);
        locals.push(local);
      } while (items.length > 0);

      var that = this, worker;
      (worker = function() {
        if (locals.length === 0)
          return cb();

        var local = locals.pop();

        var tmpl = clone(template);
        tmpl.data = {};
        tmpl.path = local.page.current;
        tutils.parsePath(tmpl);
        //_.extend(tmpl.data, local);
        tmpl.render(local, function(err) {
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
