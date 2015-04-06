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

var _ = require('lodash');

var stringPattern = function(pattern) {
  return function(index) {
    return pattern.replace(':num:', (index > 0) ? ''+index : '');
  };
};

module.exports = function(pattern) {
  if (_.isString(pattern))
    return stringPattern(pattern);
  if (_.isFunction(pattern))
    return pattern;
  return undefined;
};
