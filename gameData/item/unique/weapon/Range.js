const Weapon = require('../Weapon');
const FiredAmmo = require('./FiredAmmo');

function Range(typeId, name, itemId, durability, damage, distance, fireRate, accuracy, ammoId, reloadTime, magazineSize, currentMagazine) {
    Weapon.apply(this, arguments);
    this.accuracy = accuracy;
    this.ammoId = ammoId;
    this.reloadTime = reloadTime;
    this.magazineSize = magazineSize;
    this.currentMagazine = currentMagazine;
    this.isReloaded = true;
    this.isFireRateReady = true;
}
Range.prototype = Object.create(Weapon.prototype);


Range.prototype.shot = function (firedAmmos, personId, initialX, initialY, toX, toY) {
    let result=null;
    if (this.isReloaded&&this.isFireRateReady&&this.currentMagazine>0) {
        this.currentMagazine--;
        //this.damage--;
        for (let i = 0; i<firedAmmos.length; i++){
            if (!firedAmmos[i].active){
              firedAmmos[i].charge(personId, this.damage, initialX, initialY, toX, toY, this.accuracy, this.distance)
              result = firedAmmos[i];
              break;
            }
            if (i===firedAmmos.length-1){
              firedAmmos.push(firedAmmos[0].newCharge(personId, this.damage, initialX, initialY, toX, toY, this.accuracy, this.distance));
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
};
Range.prototype.reloadWeapon = function (size) {
    this.isReloaded = false;
    setTimeout(function () {
        this.isReloaded = true;
        this.currentMagazine=size;
    }.bind(this), this.reloadTime);
}

// Range.prototype.setReloaded = function () {
//     this.isReloaded = true;
//     this.currentMagazine=1;
// }


module.exports = Range;