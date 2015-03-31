'use strict';

/*
 * Global dependencies
 */

var through2 = require('through2');
var File = require('vinyl');
var _ = require('lodash');

/*
 * Local dependencies
 */

var organizer = require('./organizer');

module.exports = function(assemble) {
  // option defaults
  var defaultOptions = {
    limit: 10
  };

  // introduce renderable `index` template collection
  assemble.create('index', 'indices', {isRenderable: true});

  return function(template, options) {
    // buidl options object
    options = _.extend({}, defaultOptions, assemble.option('index'), options);

    var items = [];
    return through2.obj(function(file, enc, callback) {
      this.push(file);
      items.push(file.data);
      callback();
    }, function(cb) {
      // Get the template that was defined by the user in the options
      //TODO check for existance
      var tmpl = assemble.views.indices[template];

      //TODO clone tmpl
      //TODO filter data
      //TODO add data to tmpl
      //TODO pass tmpl down stream
      
      /**
       * Here, we can now work with the `files` array, which is the
       * entire list of files that were pushed through. Using tags as the example
       * We need to:
       *
       *   - loop over the files
       *   - get the tags from `file.data` of each file to build up an array of all tags
       *   - loop back over the tags to build the index.
       *
       * we might be able to optimize by doing some of this work in the main
       * function before files are pushed through. But for relative links, etc.
       * we need the entire list anyway.
       */


       /**
        * Now, we will take the context object that we just created in the `tags` loop
        * and add it to the `file.data` object of the template. We _could_ instead pass
        * the object to the render method, but passing it on `file.data` ensures that it
        * will be used as context on this template only.
        */

      // var that = this;
      // assemble.render(tmpl, function(err, content) {
      //   if (err) {
      //     console.log(err);
      //     return cb(err);
      //   }


      //   var file = new File({path: opts.dest});
      //   file.data = {};
      //   file.contents = new Buffer(content);
      //   that.push(file);
      //   cb();
      // });
    });
  };
};
