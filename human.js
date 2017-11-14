class Human {
	constructor({id=-1, idInventory =0, isPlayer = true, column = 10, row =  10, top = row*64, left = column*64, health = 3, strengh = 1}) {
		this.id = id;
		this.idInventory = idInventory;
		this.isPlayer = isPlayer;
		this.size = 64;
		this.column = column;
		this.row = row;
		this.top = top;
		this.left = left;
		this.health = health;
		this.strengh = strengh;
		this.isAlive = true;

	}
}
exports.Human = Human;