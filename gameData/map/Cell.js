class Cell {
	constructor({movable = true, column = null, row = null, objectId = null}) {
		this.column = column;
		this.row = row;
		this.movable = movable;
		this.objectId = objectId;
	}
}

module.exports = Cell;