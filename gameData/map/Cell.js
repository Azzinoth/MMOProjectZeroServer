function Cell(column, row, movable, objectId, mapItemId) {
	this.column = column;
	this.row = row;
	this.movable = movable;
	this.objectId = objectId;
  this.mapItemId = mapItemId;
}

module.exports = Cell;