/**
 * assemble-plugin-index
 * https://github.com/vwochnik/assemble-plugin-index
 *
 * Copyright (c) 2015 Vincent Wochnik, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var index = require('./lib');

module.exports = function(assemble) {
  // introduce renderable `index` template collection
  assemble.create('index', 'indices', {isRenderable: true});

  // forward call to library
  return function() {
    return index.apply(assemble, arguments);
  };
};
