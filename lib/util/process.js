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
 * Returns a processing function chaining all processing functions given.
 * @param {Array} Array of processing functions.
 * @return {Function} Processing function
 */
module.exports = function(process) {
  if (typeOf(process) !== 'array') {
    process = [process];
  }

  for (var i = 0; i < process.length; i++) {
    if (typeOf(process[i]) !== 'function') {
      return undefined;
    }
  }

  return function(items, cb) {
    var that = this;
    var fn; (fn = function(idx) {
      if (idx >= process.length) {
        return cb(null, items);
      }

      process[idx].call(that, items, function(err, items2){
        if (err) {
          return cb(err);
        }

        items = items2;
        fn(idx+1);
      });
    }).call(that, 0);
  };
};
