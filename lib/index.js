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

  return function(template, options) {
    // buidl options object
    options = _.extend({}, defaultOptions, assemble.option('index'), options);

    // Get the template that was defined by the user in the options
    //TODO check for existance
    var tmpl = assemble.views.indices[template];

    if (!_.has(options, 'pattern')) options.pattern = tmpl.data.src.name+':num:'+tmpl.data.src.extname;

    var items = [], page = pagination(options.pattern), locals = [];
    return through2.obj(function(file, enc, callback) {
      this.push(file);
      items.push(file.data);
      callback();
    }, function(cb) {
      do {
        var local = { items: [], page: page() };
        while ((local.items.length < options.limit) && (items.length > 0))
          local.items.push(items.splice(-1,1)[0]);
        locals.push(local);
      } while (items.length > 0);

      var that = this;
      function generateNext() {
        var local = locals.pop();
        assemble.render(tmpl, local, function(err, content) {
          if (err) {
          console.log(err);
          return cb(err);
          }

          var file = new File({path: local.page.current});
          file.data = _.extend({}, clone(tmpl.data), local);
          file.contents = new Buffer(content);
          that.push(file);

          if (locals.length > 0)
            generateNext();
          else
            cb();
        });
      }
      generateNext();

      /*var file = new File({path: 'testindex.hbs'});
      file.contents = new Buffer(tmpl.content);
      file.data = _.extend(clone(tmpl.data), locals);
      this.push(file);
      */

      /*
      var file = clone(tmpl);
      _.extend(file.data, locals);

      var file2 = new File({path: 'testindex.hbs'});
      file2.contents = new Buffer(file.content);
      file2.data = file.data;
      this.push(file2);
      */


      //TODO recursive algorithm
      // call recursive
      // -> pop item into locals until locals.length == limit
      // -> render and push onto stream
      // -> if items left call recursive
    });
  };
};
