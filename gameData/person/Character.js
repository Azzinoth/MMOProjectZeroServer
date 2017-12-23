const getTime = require('../../utils/getTime');
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
		this.direction = -1;
    	this.normalSpeed = 64;
    	this.currentSpeed = 64;
		this.currentTick = null;
    	this.lastTick = null;
    	this.tmpDistanceWalked = 0;
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
Character.prototype.move = function(left, top, column, row){
	this.left = left;
	this.top = top;
	this.column = column;
    this.row = row;
    // switch(this.direction) {
    //     case 0:
    //         this.top--;
    //         this.row = Math.floor(this.top / 64);
    //         //this.direction = 1;
    //         break;
    //     case 1:
    //         this.top--;
    //         this.left++;
    //         this.column = Math.floor(this.left / 64);
    //         this.row = Math.floor(this.top / 64);
    //         //this.direction = 7;
    //         break;
    //     case 2:
    //         this.left++;
    //         this.column = Math.floor(this.left / 64);
    //         //this.direction = 2;
    //         break;
    //     case 3:
    //         this.top++;
    //         this.left++;
    //         this.column = Math.floor(this.left / 64);
    //         this.row = Math.floor(this.top / 64);
    //         //this.direction = 6;
    //         break;
    //     case 4:
    //         this.top++;
    //         this.row = Math.floor(this.top / 64);
    //         //this.direction = 0;
    //         break;
    //     case 5:
    //         this.top++;
    //         this.left--;
    //         this.column = Math.floor(this.left / 64);
    //         this.row = Math.floor(this.top / 64);
    //         //this.direction = 4;
    //         break;
    //     case 6:
    //         this.left--;
    //         this.column = Math.floor(this.left / 64);
    //         // this.direction = 3;
    //         break;
    //     case 7:
    //         this.top--;
    //         this.left--;
    //         this.column = Math.floor(this.left / 64);
    //         this.row = Math.floor(this.top / 64);
    //         //this.direction = 5;
    //         break;
    // }
}
module.exports = Character;