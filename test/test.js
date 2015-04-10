'use strict';

var extname = require('gulp-extname');
var assemble = require('assemble');
var assert = require('assert');

var Index = require('../');

describe('assemble-plugin-index', function () {
  var inst = null;
  var index = null;
  beforeEach(function () {
    inst = assemble.init();
    index = Index(inst);
  });

  it('should add new pages to the correct collection', function (done) {
    var renameKey = inst.option('renameKey');

    inst.option('layout', 'default');
    inst.option('assets', 'test/actual/dest/assets');

    inst.layouts(['test/fixtures/layouts/*.hbs']);
    inst.indices(['test/fixtures/indices/*.hbs']);

    inst.task('test', function () {
      return inst.src('test/fixtures/pages/*.hbs')
        .pipe(index('index', { filter: ['title'] }))
        .on('data', function (file) {
          var key = renameKey(file.path);
          assert.equal(inst.views['__task__tests'][key].path, file.path);
          assert.equal(inst.files[key].path, file.path);
        })
        .on('end', function () {
          assert(inst.views['__task__tests'].hasOwnProperty('index'));
          assert(inst.views['__task__tests'].hasOwnProperty('index1'));
          assert(inst.files.hasOwnProperty('index'));
          assert(inst.files.hasOwnProperty('index1'));
        })
        .pipe(extname())
        .pipe(inst.dest('test/actual/dest'));
    });
    inst.task('default', ['test'], function () { done(); });
    inst.run('default');
  });
});
