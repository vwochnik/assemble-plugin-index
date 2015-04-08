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

var clone = require('clone-deep');
var tutils = require('template-utils');
var _ = require('lodash');

/**
 * Instantiates a pagination emitter.
 * @param template Template to use for new pages.
 * @param limit Page item limit.
 * @param nameFunc A function returning a new page name.
 */
function Paginator(template, limit, nameFunc) {
  this.template = template;
  this.limit = limit;
  this.nameFunc = nameFunc;
  this.pages = [];
  this.paths = [];
}

/**
 * Pushes item onto the last created page.
 * @param {Object} Item to push on page.
 * @return {Object} Newly created page template or undefined.
 */
Paginator.prototype.push = function(item) {
  var newpage = undefined,
      page = this.pages.slice(-1)[0];
  if ((!page) || (page.data.items.length >= this.limit))
    newpage = page = this.page();
  page.data.items.push(item);
  return newpage;
};

/**
 * Clones and prepares template for new page.
 * @return {Object} New template instance with pagination.
 */
Paginator.prototype.page = function() {
  // retrieve page name
  var name = this.nameFunc(this.pages.length);

  var tmpl = clone(this.template);
  tmpl.data = _.omit(tmpl.data, ['src', 'dest']);
  tmpl.path = name + (tmpl.ext || tmpl.extname);
  tutils.parsePath(tmpl);

  _.extend(tmpl.data, {
    items: [],
    pagination: {
      index: this.pages.length,
      first: (this.pages.length > 0) ? this.pages[0].path : tmpl.path,
      prev: (this.pages.length > 0) ? this.pages[this.pages.length-1].path : undefined,
      current: tmpl.path,
      next: null,
      last: null,
      pages: this.paths,
      isFirst: (this.pages.length === 0),
      isLast: true
    }
  });

  if (this.pages.length > 0) {
    var lastPage = this.pages[this.pages.length - 1];
    lastPage.data.pagination.next = tmpl.path;
  }

  for (var i = 0; i < this.pages.length; i++) {
    this.pages[i].data.pagination.last = tmpl.path;
    this.pages[i].data.pagination.isLast = (!!this.pages[i].next);
  }

  this.paths.push(tmpl.path);
  this.pages.push(tmpl);
  return tmpl;
};

module.exports = Paginator;
