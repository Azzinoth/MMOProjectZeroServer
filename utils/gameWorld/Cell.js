function Cell({ movable = true, column = null, row = null, cellSize = 64, id = null }) {
  this.id = id;
  this.column = column;
  this.row = row;
  this.cellSize = cellSize;
  this.movable = movable;
}

module.exports = Cell;