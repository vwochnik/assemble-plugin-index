/*
 * assemble-plugin-index
 * https://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Global dependencies
 */

var _ = require('lodash');

var defaultFilter = function() {
  return function(data) {
    return _.omit(data, ['src', 'dest']);
  };
};

var singlePropertyFilter = function(prop) {
  return function(data) {
    if (!_.has(data, prop))
      return undefined;
    return _.pick(_.omit(data, _.difference(['src', 'dest'], [prop])), prop);
  };
};

var multiPropertyFilter = function(props) {
  return function(data) {
    for (var n = 0; n < props.length; n++) {
      if (!_.has(data, props[n]))
        return undefined;
    }
    return _.pick(_.omit(data, _.difference(['src', 'dest'], props)), props);
  };
};

module.exports = function(filter) {
  if (_.isString(filter))
    return singlePropertyFilter(filter);
  if (_.isArray(filter))
    return multiPropertyFilter(filter);
  if (_.isFunction(filter))
    return filter;
  if (filter) // anything else
    return undefined;
  return defaultFilter();
};
