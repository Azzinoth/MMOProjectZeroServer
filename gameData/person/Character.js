const getTime = require('../../utils/getTime');
const cellUtils = require('../map/cellUtils');
const initialize = require('../../network/initialize')
function Character (id, accountId, inventoryId, armorInventoryId, hotBarId, activeHotBarCell, isOnline, column, row, top, left, level, health, strength, viewDistance){
		this.id = id;
		this.accountId = accountId;
		this.inventoryId = inventoryId;
		this.armorInventoryId = armorInventoryId;
		this.hotBarId = hotBarId;
		this.activeHotBarCell = activeHotBarCell;
		this.isOnline = isOnline;
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
		this.direction = -1;
		this.timeToResurrection = null;
		this.normalSpeed = 64;
		this.currentSpeed = 64;
		this.currentTick = null;
		this.lastTick = null;
		this.tmpDistanceWalked = 0;
}
Character.prototype.getNewCoord = function(){
	this.currentTick = getTime.getTimeInMs();
    let time = (this.currentTick - this.lastTick) / 1000;
    this.tmpDistanceWalked += this.currentSpeed * time;

	let newLeft = this.left;
	let newTop = this.top;

	if (this.tmpDistanceWalked > 1) {
        switch(this.direction) {
		case 0:
			newTop-=this.tmpDistanceWalked;
			// this.row = Math.floor(this.top / 64);
			//this.direction = 1;
			break;
		case 1:
			newTop-=this.tmpDistanceWalked;
			newLeft+=this.tmpDistanceWalked;
			// this.column = Math.floor(this.left / 64);
			// this.row = Math.floor(this.top / 64);
			//this.direction = 7;
			break;
		case 2:
			newLeft+=this.tmpDistanceWalked;
			// this.column = Math.floor(this.left / 64);
			//this.direction = 2;
			break;
		case 3:
			newTop+=this.tmpDistanceWalked;
			newLeft+=this.tmpDistanceWalked;
			break;
		case 4:
			newTop+=this.tmpDistanceWalked;
			break;
		case 5:
			newTop+=this.tmpDistanceWalked;
			newLeft-=this.tmpDistanceWalked;
			break;
		case 6:
			newLeft-=this.tmpDistanceWalked;

			break;
		case 7:
			newTop-=this.tmpDistanceWalked;
			newLeft-=this.tmpDistanceWalked;
			break;
        }
        this.tmpDistanceWalked = 0;
        this.lastTick = getTime.getTimeInMs();
	}

	return new Array(newLeft, newTop);

}
Character.prototype.move = function(cellsMap, left, top, column, row){
	if ((column===this.column&&row===this.row)||cellUtils.isMovableCell(cellsMap, this.row, row, this.column, column, this.id)){
    this.left = left;
    this.top = top;
    this.column = column;
    this.row = row;
    return true;
	} else return false;
}
Character.prototype.dead = function(inventories, stacks){
	this.column = 10;
	this.row = 10;
	this.isAlive=false;
	this.left = this.column*64;
	this.top = this.row*64;
	this.direction = -1;
	this.health = 10;
  this.timeToResurrection = 10;
  inventories[this.inventoryId].clear(stacks);
  inventories[this.armorInventoryId].clear(stacks);
  inventories[this.hotBarId].clear(stacks);
};
Character.prototype.respawn = function(data){
  this.isAlive=true;
  initialize(data, this.id);
};

module.exports = Character;