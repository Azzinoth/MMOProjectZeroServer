const Animal = require('../Animal');
const getFinalCoord = require('../../../utils/finalCoordByDist');
const distanceUtils = require('../../../utils/distanceUtils');
const Location = require('../../Location');
const constans = require('../../../constants/constans');
function Coward(id, location) {
  Animal.apply(this, arguments);
  this.distanceRunAway = 1280;
  this.fearDistance = 128;
  this.fearTick = 0;
}
Coward.prototype = Object.create(Animal.prototype);

Coward.prototype.fear = function (enemyCoordX, enemyCoordY) {
  this.stop();
  this.stage = 3;
  let finalCoord = getFinalCoord(enemyCoordX, enemyCoordY, this.location.left, this.location.top, this.distanceRunAway);
  let column = Math.floor(finalCoord[0]/64);
  let row = Math.floor(finalCoord[1]/64);
  if (column<=0||column>=constans.mapWidth||row<=0||row>=constans.mapHeight){
    this.chooseNewDestination();
  }else{
    this.destination=new Location(column, row, finalCoord[0], finalCoord[1]);
  }
  this.speed = Math.floor(this.normalSpeed*2);
  this.move();
}
Coward.prototype.checkActionTick = function (characters) {
  let result = null;
  this.fearTick++;
  if (this.fearTick>5)this.fearTick=0;
  if (this.stage===3){
    this.move();
    if (this.path.length===0)this.stage=0;
    // if (this.speed===this.normalSpeed){
    //   this.stage=0;
    // }else return null;
    return result;
  }

  if (this.fearTick===0){
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
      result = 2;
    }
  }
  return result;
};

module.exports = Coward;