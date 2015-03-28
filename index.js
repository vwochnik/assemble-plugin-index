/*
 * assemble-plugin-index
 * hhttps://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(params, next) {

  var path = require('path');
  var matter = require('gray-matter');
  var _ = require('lodash');

  var assemble = params.assemble;
  var grunt = assemble.grunt;
  var file = grunt.file;

  var generateIndexPagesForCollection = function(options, items) {
    var indexPages = [];

    // extend default options
    options = _.extend({
      'limit': 10,
      'prefix': 'index'
    }, options);

    // adds new index page onto array
    var addIndexPage = function() {
      var template = options.template;
      var ext = path.extname(template);

      var filename = options.prefix + ((indexPages.length !== 0) ? indexPages.length : '') + '.html';
      var dest = path.join(options.dest, filename);

      var layout = _.cloneDeep(assemble.options.defaultLayout);
      var context = processContext(grunt,
        _.extend({}, assemble.util.filterProperties(assemble.options), layout.data, assemble.options.data));

      var tpl = grunt.file.read(template);
      var parsedPage = matter(tpl);

      var currentPage = {
          '_page': 'all',
          assets: assemble.options.assets,
          basename: path.basename(template, ext),
          dirname: path.dirname(dest),
          dest: dest,
          src: template,
          ext: assemble.options.ext,
          extname: assemble.options.ext,
          filename: filename,
          page: parsedPage.content,
          data: parsedPage.data,
      };
      currentPage.data = processContext(grunt, context, currentPage.data);
      context.page = currentPage;
      context.items = [];
      context.page.page = injectBody(layout.layout, context.page.page);
      context.indexPage = indexPages.length + 1;
      indexPages.push(context);
      return context;
    };

    // adds new item to last index page
    var addItemToIndex = function(item) {
      var indexPage = indexPages[indexPages.length-1];
      if ((options.limit >= 1) && (indexPage.items.length >= options.limit)) {
        indexPage = addIndexPage();
      }
      indexPage.items.push(item);
    };

    var buildIndexPages = function() {
      addIndexPage();

      for (var i = 0; i < items.length; i++) {
        addItemToIndex(items[i]);
      }
    };

    var updateIndexPageContexts = function() {
      for (var i = 0, n = indexPages.length; i < n; i++) {
        var context = indexPages[i];
        context.index = {
          pageIsEmpty: (context.items.length === 0),
          pageIsFirst: (i === 0),
          pageIsLast: (1 + i >= n),
          pageFirst: (n === 0) ? null : indexPages[0],
          pagePrev: (i === 0) ? null : indexPages[i-1],
          pageNext: (1 + i >= n) ? null : indexPages[i+1],
          pageLast: (n === 0) ? null : indexPages[n-1],
          pages: indexPages
        };
      }
    };

    var renderIndexPages = function() {
      var recursiveRender = function(idx, success, error) {
        var context = indexPages[idx];

        assemble.engine.render(context.page.page, context, function(err, content) {
          if (err) {
            error(err);
          } else {
            context.page.content = content;
            file.write(context.page.dest, content);

            if (++idx < indexPages.length) {
              recursiveRender(idx, success, error);
            } else {
              success();
            }
          }
        });
      };

      grunt.log.write('Assembling ' + (''+indexPages.length).cyan +' index pages ');
      recursiveRender(0, function() {
        grunt.log.ok();
        next(null, indexPages);
      }, function(err) {
        grunt.log.error();
        next(err);
      });
    };

    buildIndexPages();
    updateIndexPageContexts();
    renderIndexPages();
  };

  var injectBody = function(layout, body) {
    return layout.replace(assemble.engine.bodyRegex, body);
  };

  var processContext = function(grunt, context, data) {
    grunt.config.data = _.extend({}, grunt.config.data, context, data);
    return grunt.config.process(data || context);
  };

  _.forOwn(assemble.options.collections, function(collection, name) {
    if (undefined !== collection.index) {
      generateIndexPagesForCollection(collection.index, assemble.options[name]);
    }
  });
};

module.exports.options = {
  stage: 'render:post:pages'
};
