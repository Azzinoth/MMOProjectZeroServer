const acccuracy = require('../../../../utils/accuracy');
const getFinalCoord = require('../../../../utils/finalCoordByDist');
function FiredAmmo() {
    this.damage = 0;
    this.radius = 0;
    this.characterId = 0;
    this.initialX = 0;
    this.initialY = 0;

    this.finalX = 0;
    this.finalY = 0;

    this.speedPerSec = 0;
    this.distToFinal = 0;
    this.timeToFinal = 0;
    this.timePassed = 0;
    this.maxTime = 0;

    this.active = false;
    this.currentTick = 0;
    this.lastTick = 0;
}
FiredAmmo.prototype.charge = function (personId, damage, fromX, fromY, vectorX, vectorY, accuracy, distance) {
  this.damage = damage;
  this.radius = 1;
  this.characterId = personId;
  this.speedPerSec = 750;
  this.initialX = fromX-5;
  this.initialY = fromY-32;
  if (accuracy!==null){
    let accuracyShot=acccuracy(accuracy, this.initialX, this.initialY, vectorX, vectorY);
    vectorX = accuracyShot[0];
    vectorY = accuracyShot[1];
  }
  let finalCoord = getFinalCoord(this.initialX, this.initialY, vectorX, vectorY, distance);
  this.finalX = finalCoord[0];
  this.finalY = finalCoord[1];
  this.distToFinal = Math.sqrt(Math.pow(this.initialX - this.finalX, 2) + Math.pow(this.initialY - this.finalY, 2));
  this.timeToFinal = this.distToFinal / this.speedPerSec * 1000;
  this.maxTime = distance / this.speedPerSec * 1000;
  let time = new Date().getTime();
  this.currentTick = time;
  this.lastTick = time;
  this.timePassed = 0;
  this.active = true;

}
FiredAmmo.prototype.newCharge = function (personId, damage, fromX, fromY, vectorX, vectorY, accuracy, distance) {
    let ammo = new FiredAmmo();
    ammo.characterId = personId;
    ammo.speedPerSec = 750;
    ammo.initialX = fromX-5;
    ammo.initialY = fromY-32;
    if (accuracy!==null){
      let accuracyShot=acccuracy(accuracy, ammo.initialX, ammo.initialY, vectorX, vectorY);
      vectorX = accuracyShot[0];
      vectorY = accuracyShot[1];
    }
    let finalCoord = getFinalCoord(this.initialX, this.initialY, vectorX, vectorY, distance);
    ammo.finalX = finalCoord[0];
    ammo.finalY = finalCoord[1];
    ammo.distToFinal = Math.sqrt(Math.pow(ammo.initialX - ammo.finalX, 2) + Math.pow(ammo.initialY - ammo.finalY, 2));
    ammo.timeToFinal = ammo.distToFinal / ammo.speedPerSec * 1000;
    ammo.maxTime =distance / this.speedPerSec * 1000;
    let time = new Date().getTime();
    ammo.currentTick = time;
    ammo.lastTick = time;
    ammo.timePassed = 0;
    ammo.active = true;
    return ammo;
}
module.exports = FiredAmmo;