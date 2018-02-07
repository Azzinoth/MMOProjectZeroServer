const Weapon = require('../Weapon');
const FiredAmmo = require('./FiredAmmo');
const getFinalCoord = require('../../../../utils/finalCoordByDist');
function Melee(typeId, name, itemId, durability, damage, distance, fireRate) {
  Weapon.apply(this, new Array(typeId, name, itemId, durability, damage, distance, fireRate));
  this.isFireRateReady = true;
}
Melee.prototype = Object.create(Weapon.prototype);

Melee.prototype.shot = function (firedAmmos, personId, initialX, initialY, toX, toY) {
  let result=null;
  if (this.isFireRateReady) {
    //this.damage--;
    for (let i = 0; i<firedAmmos.length; i++){
      if (!firedAmmos[i].isActive){
        firedAmmos[i].charge(personId, this.damage, initialX, initialY, toX, toY, null, this.distance);
        result = firedAmmos[i];
        break;
      }
      if (i===firedAmmos.length-1){
        firedAmmos.push(firedAmmos[0].newCharge(personId, this.damage, initialX, initialY, toX, toY, null, this.distance));
        result = firedAmmos[firedAmmos.length-1];
        break;
      }
    }
    if (this.fireRate!==null){
      this.isFireRateReady = false;
      setTimeout(function (){
        this.isFireRateReady = true;
      }.bind(this), this.fireRate);
    }
    return result;
  }
  return result;
}

module.exports = Melee;