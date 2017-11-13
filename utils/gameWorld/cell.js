function Cell({ movable = true, column = null, row = null, size = 64, id = null }) {
  this.id = id;
  this.column = column;
  this.row = row;
  this.size = size;
  this.movable = movable;
}

module.exports = Cell;