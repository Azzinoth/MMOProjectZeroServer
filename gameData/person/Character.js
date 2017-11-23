class Character {
	constructor({id=-1, idInventory =0, isPlayer = true, column = 10, row =  10, top = row*64, left = column*64, health = 3, strength = 1}) {
		this.id = id;
		this.idInventory = idInventory;
		this.isPlayer = isPlayer;
		this.size = 64;
		this.column = column;
		this.row = row;
		this.top = top;
		this.left = left;
		this.health = health;
		this.strength = strength;
		this.isAlive = true;
		this.craftRecipesId = [];
	}
}
module.exports = Character;