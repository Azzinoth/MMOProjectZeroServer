function Character (id, inventoryId, armorInventoryId, hotBarId, activeHotBarCell, isPlayer, column, row, top, left, level, health, strength, viewDistance){
		this.id = id;
		this.inventoryId = inventoryId;
    	this.armorInventoryId = armorInventoryId;
		this.hotBarId = hotBarId;
    	this.activeHotBarCell = activeHotBarCell;
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
		this.viewDistance = viewDistance;
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
	craftRecipesId : []
}
module.exports = Character;