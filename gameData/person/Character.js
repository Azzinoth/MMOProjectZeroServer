function Character (id, inventoryId, isPlayer, column, row, top, left, level, health, strength){
		this.id = id;
		this.inventoryId = inventoryId;
		this.isPlayer = isPlayer;
		this.size = 64;
		this.column = column;
		this.row = row;
		this.top = top;
		this.left = left;
    	this.level = level;
		this.health = health;
		this.strength = strength;
		this.isAlive = true;
		this.armId = null;
		this.bodyId = null;
		this.headId = null;
		this.craftRecipesId = [];
}
let characterPtoto={
    id : null,
	inventoryId : null,
	isPlayer : null,
	size : 64,
	column : null,
	row : null,
	top : null,
	left : null,
	level : null,
	health : null,
	strength : null,
	isAlive : true,
	armId : null,
	bodyId : null,
	headId : null,
	craftRecipesId : []
}
module.exports = Character;