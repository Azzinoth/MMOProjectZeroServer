class Field {
	constructor({movable = true, column = null, row = null}) {
		this.column = column;
		this.row = row;
		this.size = 64;
		this.movable = movable;
		this.idObject = null;
	}
}

exports.Field = Field;