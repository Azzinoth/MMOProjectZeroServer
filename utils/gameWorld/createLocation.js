const _ = require('lodash');
const Cell = require('./cell');

const defaultLocationWidth = 2048;
const defaultLocationHeight = 2048;

function createLocation(width = defaultLocationWidth, height = defaultLocationHeight) {
  return _.range(0, height).map(column => {
    return _.range(0, width).map(row => new Cell({ movable: true, column, row }));
  });
}

module.exports = createLocation;
