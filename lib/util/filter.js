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

var typeOf = require('kind-of');
var extend = require('extend-shallow');
var pick = require('object.pick');
var omit = require('object.omit');
var diff = require('arr-diff');

/**
 * Returns a filter function utilizing a filter expression.
 * @param {Array} Filter expression containing all properties data is filtered by.
 * @return {Function} filter function
 */
module.exports = function(filter) {
  if (typeOf(filter) !== 'array')
    filter = [filter];
  for (var i = 0; i < filter.length; i++) {
    if (typeOf(filter[i]) !== 'string')
      return undefined;
  }
  var exclude = diff(['src', 'dest'], filter);

  return function(data) {
    var result = pick(omit(data, exclude), filter);
    filter.forEach(function(value) {
      if ((result) && (!result.hasOwnProperty(value)))
        result = null;
    });
    return result;
  };
};
