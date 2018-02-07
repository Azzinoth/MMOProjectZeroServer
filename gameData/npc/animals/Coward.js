const Animal = require('../Animal');
const getFinalCoord = require('../../../utils/finalCoordByDist');
const distanceUtils = require('../../../utils/distanceUtils');
const Location = require('../../Location');
const constans = require('../../../constants/constans');
function Coward(id, location) {
  Animal.apply(this, arguments);
  this.distanceRunAway = 1280;
  this.fearDistance = 128;
  this.fearTick = 64;
  this.currentFearTick = 0;
}
Coward.prototype = Object.create(Animal.prototype);
Coward.prototype.fear = function (enemyCoordX, enemyCoordY) {
  this.stop();
  this.isAction = true;
  let finalCoord = getFinalCoord(enemyCoordX, enemyCoordY, this.location.left, this.location.top, this.distanceRunAway);
  let column = Math.floor(finalCoord[0]/64);
  let row = Math.floor(finalCoord[1]/64);
  if (column<=0||column>=constans.mapWidth||row<=0||row>=constans.mapHeight){
    this.chooseNewDestination();
  }else{
    this.destination=new Location(column, row, finalCoord[0], finalCoord[1]);
  }
  this.speed = Math.floor(this.normalSpeed*2);
}
Coward.prototype.checkActionTick = function (characters) {
  if (this.isAction){
    if (this.speed===this.normalSpeed){
      this.isAction=false;
    }else return null;
  }
  this.currentFearTick++;
  if (this.fearTick===this.currentFearTick){
    let whoNearly = null;
    for (let key in characters){
      if (characters[key].isAlive&&characters[key].isOnline){
        let distance = distanceUtils.distance(characters[key].left, characters[key].top, this.location.left, this.location.top);
        if (distance<this.fearDistance){
          if (whoNearly===null||whoNearly[0]>distance){
            whoNearly = new Array(distance, characters[key].left, characters[key].top);
          }
        }
      }
    }
    if (whoNearly!==null){
      this.fear(whoNearly[1], whoNearly[2]);
    }
    this.currentFearTick = 0;
  }
  return null;
};

module.exports = Coward;