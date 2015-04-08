/**
 * assemble-plugin-index
 * https://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict'

/**
 * Global dependencies
 */

var _ = require('lodash');

/**
 * Instantiates a pagination emitter.
 * @param nameFunc A function returning a new page name.
 */
function Paginator(nameFunc) {
  this.nameFunc = nameFunc;
  this.pages = [];
  this.paths = [];
}

/**
 * Returns a new pagination object for a new page.
 * Previously returned objects are subject to change upon call of this function.
 * @param template Template to manipulate.
 * @param name Page name.
 * @return pagination object
 */
Paginator.prototype.page = function(template, items) {
  // retrieve page name
  var name = this.nameFunc(this.pages.length, items);

  template.path = name + (template.ext || template.extname);
  _.extend(template.data, {
    items: items,
    pagination: {
      first: (this.pages.length > 0) ? this.pages[0].path : template.path,
      prev: (this.pages.length > 0) ? this.pages[this.pages.length-1].path : undefined,
      current: template.path,
      next: null,
      last: null,
      pages: this.paths,
      isFirst: (this.pages.length == 0),
      isLast: true
    }
  });

  if (this.pages.length > 0) {
    var lastPage = this.pages[this.pages.length - 1];
    lastPage.data.pagination.next = template.path;
  }

  for (var i = 0; i < this.pages.length; i++) {
    this.pages[i].data.pagination.last = template.path;
    this.pages[i].data.pagination.isLast = (!!this.pages[i].next);
  }

  this.paths.push(template.path);
  this.pages.push(template);
};

module.exports = Paginator;
