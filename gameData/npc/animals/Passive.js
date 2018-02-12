const Animal = require('../Animal');
const distanceUtils = require('../../../utils/distanceUtils');
const Location = require('../../Location');
const constants = require('../../../constants/constans');
function Passive(id, location) {
  Animal.apply(this, arguments);
  this.chaseDistance = 1000;
  this.damage = 4;
  this.attackDistance = 64;
  this.chaseTick = 0;
  this.targetId = null;
  this.fireRate = 150;
  this.currentFireRate = 0;
}
Passive.prototype = Object.create(Animal.prototype);
Passive.prototype.chase = function (enemyCoordX, enemyCoordY, targetId) {
  this.stop();
  this.stage = 4;
  this.destination = new Location(Math.floor(enemyCoordX/constants.cellSize), Math.floor(enemyCoordY/constants.cellSize), enemyCoordX-32, enemyCoordY-64);
  this.speed = Math.floor(this.normalSpeed*2);
  this.targetId = targetId;
  this.move();
};

Passive.prototype.checkActionTick = function (characters) {
  let result = null;
  this.chaseTick++;
  if (this.currentFireRate!==this.fireRate) this.currentFireRate++;
  if (this.chaseTick>10)this.chaseTick=0;
  let distance = null;
  if (this.stage === 4){
    this.move();
    if (this.chaseTick===0) {
      if (this.destination===null || characters[this.targetId].column !== this.destination.column || characters[this.targetId].row !== this.destination.row) {
        this.chase(characters[this.targetId].left, characters[this.targetId].top, this.targetId);
        result = 2;
      }
      distance = distanceUtils.distance(this.location.left, this.location.top, characters[this.targetId].left, characters[this.targetId].top);
      if (distance < this.attackDistance) {
        this.stop();
        this.stage = 5;
        result = 2;
      }
    }

  }else if (this.stage === 5){
    if (this.chaseTick===1) {
      if (distance === null)distance = distanceUtils.distance(this.location.left, this.location.top, characters[this.targetId].left, characters[this.targetId].top);
      if (distance < this.attackDistance) {
        if (this.currentFireRate===this.fireRate){
          if (characters[this.targetId].health <= this.damage) {
            this.stage = 0;
            //this.targetId = null;

          }
          result = 1;
          this.currentFireRate = 0;
        }
      } else if (distance > this.chaseDistance) {
        this.stage = 0;
        this.targetId = null;
      } else {
        this.stage = 4;
      }
    }
  }
  return result;
};
module.exports = Passive;