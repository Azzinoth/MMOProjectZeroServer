const Animal = require('../Animal');
const distanceUtils = require('../../../utils/distanceUtils');
const Location = require('../../Location');
const constants = require('../../../constants/constans');
function Passive(id, location) {
  Animal.apply(this, arguments);
  this.chaseDistance = 1000;
  this.damage = 4;
  this.attackDistance = 64;
  this.chaseTick = 100;
  this.currentChaseTick = 0;
  this.targetId = null;

}
Passive.prototype = Object.create(Animal.prototype);
Passive.prototype.chase = function (enemyCoordX, enemyCoordY, targetId) {
  this.stop();
  this.isAction = true;
  this.destination = new Location(Math.floor(enemyCoordX/constants.cellSize), Math.floor(enemyCoordY/constants.cellSize), enemyCoordX-32, enemyCoordY-64);
  this.speed = Math.floor(this.normalSpeed*1.5);
  this.targetId = targetId;
};
Passive.prototype.checkActionTick = function (characters) {
  if (!this.isAction) return null;

  this.currentChaseTick++;

  if (this.chaseTick<=this.currentChaseTick){
    this.currentChaseTick = 0;
    if (characters[this.targetId].column!==this.destination.column||characters[this.targetId].row!==this.destination.row){
      this.chase(characters[this.targetId].left, characters[this.targetId].top, this.targetId);
    }
    let distance = distanceUtils.distance(this.location.left, this.location.top, characters[this.targetId].left, characters[this.targetId].top);
    if (distance<this.attackDistance){
      this.stop();
      return 1;
    }else if (distance>this.chaseDistance){
      this.isAction = false;
      this.stop();
    }
  }
  return null;
};
module.exports = Passive;