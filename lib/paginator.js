/*
 * assemble-plugin-index
 * https://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict'

/*
 * Global dependencies
 */

var _ = require('lodash');

/**
 * Instantiates a pagination emitter.
 * @param pattern a pattern to use as relative urls
 */
function Paginator(pattern) {
  this.pattern = pattern;
  this.pages = [];
}

/**
 * Returns a new pagination object for a new page.
 * Previously returned objects are subject to change upon call of this function.
 * @return pagination object
 */
Paginator.prototype.page = function(template) {
  var name = getPageFromPattern(this.pattern, this.pages.length);

  template.path = name + (template.ext || template.extname);

  var pagination = {
    first: (this.pages.length > 0) ? this.pages[0].path : template.path,
    prev: (this.pages.length > 0) ? this.pages[this.pages.length-1].path : undefined,
    current: template.path,
    next: undefined,
    last: undefined,
    pages: [],
    isFirst: (this.pages.length == 0),
    isLast: true
  };

  if (this.pages.length > 0) {
    var lastPage = this.pages[this.pages.length - 1];
    lastPage.next = template.path;
  }

  for (var i = 0; i < this.pages.length; i++) {
    this.pages[i].last = template.path;
    this.pages[i].isLast = (!!this.pages[i].next);
  }

  this.pages.push(template);
};

function getPageFromPattern(pattern, num) {
  return pattern.replace(':num:', (num > 0) ? ''+num : '');
}

module.exports = Paginator;
