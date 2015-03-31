/*
 * assemble-plugin-index
 * https://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict'

var _ = require('lodash');

/*
 * Builds a pagination emitter.
 * @param pattern a pattern to use as relative urls
 * @return an emitter function returning a new pagination object upon calling.
 *         Emitted objects are subject to change upon re-call.
 */
module.exports = function(pattern) {
  var pages = [], results = [];

  function nextpage() {
    var num = (pages.length > 0) ? ''+pages.length : '';

    return pattern.split(':num:').join(num);
  }

  return function() {
    var page = nextpage();

    var result = {
      first: (pages.length > 0) ? pages[0] : page,
      prev: (pages.length > 0) ? pages[pages.length-1] : undefined,
      current: page,
      next: undefined,
      last: page,
      pages: pages,
      isFirst: (pages.length === 0),
      isLast: true
    };

    if (results.length > 0) {
      var last = results[results.length-1];
      last.next = last.last = page;
      last.isLast = false;
    }

    pages.push(page);
    results.push(result);
    return result;
  };
};
