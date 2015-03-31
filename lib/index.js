'use strict';

var through2 = require('through2');
var File = require('vinyl');
var _ = require('lodash');

module.exports = function(assemble) {

  // introduce renderable `index` template collection
  assemble.create('index', 'indices', {isRenderable: true});

  // `index()` pipe passthrough
  return function(template, options) {
    var items = [];

    //TODO options are supposed to be options passed to
    // assemble rather then this plugin
    // e.g. layout
    // therefore is this correct?
    options = _.extend({
      itemsPerPage: 10
    }, options);

    return through2.obj(function(file, enc, cb) {
      items.push(file.data);
      cb(null, file);
    }, function(cb) {
      var arr = [];

      //TODO does this call make a copy of the template? Since we are filling
      // it with data
      var tmpl = assemble.views.indices[template];
      tmpl.data.items = items;

      var that = this;
      assemble.render(tmpl, function(error, content) {
        if (error)
          console.log(err);

        var file = new File({path: 'posts.html'});
        file.data = {};
        file.contents = new Buffer(content);

        that.push(file);
        cb();
      });
    });
  };
};
