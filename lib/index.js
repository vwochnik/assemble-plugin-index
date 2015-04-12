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
var typeOf = require('kind-of');
var extend = require('extend-shallow');

/**
 * Local dependencies
 */

var Paginator = require('./paginator');
var filter = require('./util/filter');
var pattern = require('./util/pattern');
var process = require('./util/process');
var getName = require('./util/get-name');

/**
 * Plugin function for the generation of index templates.
 * @param {String} Identifier of an `index` template.
 * @param {Object} Options for the generation of templates.
 * @param {Object} Options for rendering templates.
 * @api public
*/
function index(key, options) {
  // jshint validthis:true
  var assemble = this;
  var plural = getName(assemble);

  // build options object
  options = extend({limit: 10}, assemble.option('index'), options);

  // Get the template that was defined by the user in the options
  var template = assemble.views.indices[key];

  // initialize helper functions
  var filterFunc = (typeOf(options.filter) === 'function')
                 ? options.filter
                 : filter(options.filter);
  var nameFunc = (typeOf(options.pattern) === 'function')
               ? options.pattern
               : pattern(options.pattern || (key+':num:'));
  var processFunc = (typeOf(options.process) !== 'undefined')
                  ? process(options.process)
                  : function(items, cb) { return cb(null, items); };

  var items = [];
  return through2.obj(function(file, enc, cb) {
    if (typeOf(filterFunc) !== 'function') {
      this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Invalid filter option.'));
      return cb();
    }

    if (!template) {
      this.emit('error', new gutil.PluginError('assemble-plugin-index', 'Index template does not exist.'));
      return cb();
    }

    this.push(file);

    var filtered = filterFunc(file.data);
    if (filtered !== null) {
      filtered = extend({url: file.relative}, filtered);
      items.push(filtered);
    }

    cb();
  }, function(cb) {
    var that = this;
    processFunc(items, function(err, items2) {
      if (err) {
        this.emit('error', new gutil.PluginError('assemble-plugin-index', err));
        return cb(err);
      }

      // initialize pagination manager
      var paginator = new Paginator(template, options.limit, nameFunc);
      items2.forEach(function(item) { paginator.push(item); });

      paginator.pages.forEach(function(page) {
        // add to pages collection
        assemble[plural](page);

        // push into stream
        that.push(tutils.toVinyl(page));
      });

      cb();
    });
  });
}

// expose plugin function
module.exports = exports = index;
