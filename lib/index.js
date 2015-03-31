'use strict';

var util = require('util');
var through2 = require('through2');
var File = require('vinyl');
var _ = require('lodash');

function dbg(obj) {
  console.log(util.inspect(obj, { showHidden: true, depth: null }));
}

module.exports = function() {
  var assemble = this;
  var collection = [];

  return through2.obj(function(file, enc, cb) {
    collection.push(file.data);
    cb(null, file);
  }, function(cb) {
    var stream = this;
    var arr = [];

    cb();
    /*// here, we add the tags from front-matter to an array.
    // we could make this more useful by also adding the dest
    // path of the file and other info.
    files.forEach(function (file) {
      arr = arr.concat(file.data.tags);
    });

    var tmpl = assemble.views.indices[template];
    tmpl.data.tags = arr;

    assemble.render(tmpl, function (err, content) {
      if (err) console.log(err);
      var file = new File({path : 'index.html'});
      // `data` needed for assemble
      file.data = {};
      file.contents = new Buffer(content);
      stream.push(file);
      cb();
    });*/
  });
};
