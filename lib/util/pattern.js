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

/**
 * Returns a pattern generator function.
 * @param {String} Pattern string with `:num` placeholder.
 * @return Pattern function.
 */
module.exports = function(pattern) {
  if (typeOf(pattern) !== 'string')
    pattern = 'index:num:';

  return function(index) {
    return pattern.replace(':num:', (index > 0) ? ''+index : '');
  };
};
