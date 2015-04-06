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

var clone = require('clone-deep');
var tutils = require('template-utils');

module.exports = function(items, paginator, template, options, cb) {
  var idx = 0, worker;

  idx = 0;
  do {
    var items2 = [];
    while ((items2.length < options.limit) && (idx < items.length))
      items2.push(items[idx++]);

    var tmpl = clone(template);
    tmpl.data = {};
    paginator.page(tmpl, items);
    tutils.parsePath(tmpl);
  } while (idx < items.length);

  idx = 0;
  (worker = function() {
    var page = paginator.pages[idx];

    page.render(function(err) {
      if (err)
        return cb(err);

      cb(null, tutils.toVinyl(page));
      if (++idx >= paginator.pages.length)
        return cb();

      worker();
    });
  })();
};
