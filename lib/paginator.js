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
var extend = require('extend-shallow');
var omit = require('object.omit');

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
  var page = this.pages.slice(-1)[0];
  if ((!page) || (page.data.items.length >= this.limit)) {
    page = this.page();
  }
  page.data.items.push(item);
};

/**
 * Clones and prepares template for new page.
 * @return {Object} New template instance with pagination.
 */
Paginator.prototype.page = function() {
  // retrieve page name
  var name = this.nameFunc(this.pages.length);

  var tmpl = clone(this.template);
  tmpl.data = omit(tmpl.data, ['src', 'dest']);
  var path = tmpl.path = name + (tmpl.ext || tmpl.extname);
  tutils.parsePath(tmpl);

  extend(tmpl.data, {
    items: [],
    pagination: {
      index: this.paths.length,
      first: this.paths[0] || path,
      prev: this.paths.slice(-1)[0] || null,
      current: tmpl.path,
      next: null,
      pages: this.paths
    }
  });

  // update `next` link of last page
  var lastPage = this.pages.slice(-1)[0];
  if (lastPage) {
      lastPage.data.pagination.next = path;
  }

  this.paths.push(path);
  this.pages.push(tmpl);

  // update pages
  this.pages.forEach(function(page) {
    page.data.pagination.isFirst = (!page.data.pagination.prev);
    page.data.pagination.isLast = (!page.data.pagination.next);
    page.data.pagination.last = path;
  });

  return tmpl;
};

module.exports = Paginator;
