/**
 * assemble-plugin-index
 * https://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Global dependencies
 */

var through2 = require('through2');
var gutil = require('gulp-util');
var tutils = require('template-utils');
var _ = require('lodash');

/**
 * Local dependencies
 */

var Paginator = require('./paginator');
var filter = require('./util/filter');
var pattern = require('./util/pattern');
var path = require('path');

module.exports = function(assemble) {
  // introduce renderable `index` template collection
  assemble.create('index', 'indices', {isRenderable: true});

  return index;

  /**
   * Plugin function for the generation of index templates.
   * @param {String} Identifier of an `index` template.
   * @param {Object} Options for the generation of templates.
   * @param {Object} Options for rendering templates.
   * @api public
  */
  function index(index, options, options2) {
    // buidl options object
    options = _.extend({limit: 10}, assemble.option('index'), options);

    // Get the template that was defined by the user in the options
    var template = assemble.views.indices[index];

    var renameFn = function (fp) {
      return path.basename(fp, path.extname(fp));
    };

    var renameKey = assemble.option('renameKey') || renameFn;

    // initialize helper functions
    var filterFunc = filter(options.filter);
    var nameFunc = pattern(options.pattern || (index+':num:'));

    // initialize pagination helper
    var paginator = new Paginator(template, options.limit, nameFunc);

    return through2.obj(function(file, enc, cb) {
      if (_.isUndefined(filterFunc)) {
        this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Invalid filter option.'));
        return cb();
      }

      if (!template) {
        this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Index template does not exist.'));
        return cb();
      }

      this.push(file);

      var filtered = filterFunc(file.data);
      if (filtered)
        paginator.push(filtered);

      cb();
    }, function(cb) {
      for (var i = 0; i < paginator.pages.length; i++) {
        var template = paginator.pages[i];

        var key = renameKey(template.path);
        assemble.views.pages[key] = template;

        this.push(tutils.toVinyl(template));
      }
      cb();
    });
  }
};
