const range = require('lodash').range;
const Cell = require('./Cell');

const defaultLocationWidth = 2048;
const defaultLocationHeight = 2048;

function createLocation(width = defaultLocationWidth, height = defaultLocationHeight) {
  return range(height).map(column => {
    return range(width).map(row => new Cell({ movable: true, column, row }));
  });
}

module.exports = createLocation;
