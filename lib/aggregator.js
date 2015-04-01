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

var path = require('path');
var _ = require('lodash');

/**
 * Instanciates a new Aggregator.
 * @param filter a filter string
 */
function Aggregator(filter) {
  this.filter = filter;
  this.items = [];
}

/**
 * Aggregates a file using the `query` parameter.
 * @param file vinyl file to aggregate from
 */
Aggregator.prototype.aggregate = function(file) {
  var result = applyFilter(file, this.filter);

  if (result) {
    this.items.push({
      url: file.relative,
      data: result
    });
  }
};

function applyFilter(file, filter) {
  return _.extend({}, file.data);
}

// export 'class'
module.exports = Aggregator;
