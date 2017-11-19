class Cell {
	constructor({movable = true, column = null, row = null}) {
		this.column = column;
		this.row = row;
		this.movable = movable;
		this.idObject = null;
	}
}

module.exports = Cell;