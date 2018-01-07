const Weapon = require('../Weapon');
const FiredAmmo = require('./FiredAmmo');
function Range(typeId, name, itemId, ammoId, durability, damage, accuracy, fireRate, distance, reloadTime, magazineSize, currentMagazine) {
    Weapon.apply(this, arguments);
    this.distance = distance;
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
                    firedAmmos[i].damage = this.damage;
                    firedAmmos[i].radius = 1;
                    firedAmmos[i].characterId = personId;
                    firedAmmos[i].speedPerSec = 750;
                    firedAmmos[i].initialX = initialX-5;
                    firedAmmos[i].initialY = initialY-32;
                    let accuracyShot1=this.getAccuracy(this.accuracy, firedAmmos[i].initialX, firedAmmos[i].initialY, toX, toY);
                    firedAmmos[i].finalX = parseInt(accuracyShot1[0]);
                    firedAmmos[i].finalY = parseInt(accuracyShot1[1]);
                    firedAmmos[i].distToFinal = Math.sqrt(Math.pow(firedAmmos[i].initialX - firedAmmos[i].finalX, 2) + Math.pow(firedAmmos[i].initialY - firedAmmos[i].finalY, 2));
                    firedAmmos[i].timeToFinal = firedAmmos[i].distToFinal / firedAmmos[i].speedPerSec * 1000;
                    firedAmmos[i].maxTime = this.distance / firedAmmos[i].speedPerSec * 1000;
                    let time = new Date().getTime();
                    firedAmmos[i].currentTick = time;
                    firedAmmos[i].lastTick = time;
                    firedAmmos[i].timePassed = 0;
                    firedAmmos[i].active = true;
                    result = firedAmmos[i];
                    break;
                }
                if (i===firedAmmos.length-1){
                    let ammo = new FiredAmmo();
                    ammo.characterId = personId;
                    ammo.speedPerSec = 750;
                    ammo.initialX = initialX.left-5;
                    ammo.initialY = initialY-32;
                    let accuracyShot1=this.getAccuracy(this.accuracy, ammo.initialX, ammo.initialY, toX, toY);
                    ammo.finalX = parseInt(accuracyShot1[0]);
                    ammo.finalY = parseInt(accuracyShot1[1]);
                    ammo.distToFinal = Math.sqrt(Math.pow(ammo.initialX - ammo.finalX, 2) + Math.pow(ammo.initialY - ammo.finalY, 2));
                    ammo.timeToFinal = ammo.distToFinal / ammo.speedPerSec * 1000;
                    ammo.maxTime =this.distance / firedAmmos[i].speedPerSec * 1000;
                    let time = new Date().getTime();
                    ammo.currentTick = time;
                    ammo.lastTick = time;
                    ammo.timePassed = 0;
                    ammo.active = true;
                    result = ammo;
                    firedAmmos.push(ammo);

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

Range.prototype.getAccuracy=function(accuracy, initX, initY, finalX, finalY) {
    let result =new Array(2);
    let angle0 = accuracy * 0.2;
    let angle1 = accuracy * 0.55;
    let angle2 = accuracy * 0.85;

    let currentAngle = 0;

    let rand = Math.random();

    if (rand <= 0.15) {
        currentAngle = 0 + angle0 * Math.random();
    } else if (rand > 0.15 && rand <= 0.7) {
        currentAngle = angle0 + (angle1 - angle0) * Math.random();
    } else if (rand > 0.7) {
        currentAngle = angle1 + (angle2 - angle1) * Math.random();
    }

    rand = Math.random();
    if (rand <= 0.5) {
        currentAngle = -currentAngle;
    }


    // * TO MOUSE VECTOR *
    let tempMagnitude = Math.sqrt(Math.pow(finalX - initX, 2) + Math.pow(finalY - initY, 2));
    let normalizedVector = new Array();

    normalizedVector.push((finalX - initX) / tempMagnitude);
    normalizedVector.push((finalY - initY) / tempMagnitude);
    // * TO MOUSE VECTOR END *

    let a = currentAngle * (Math.PI / 180.0);
    let newx = normalizedVector[0]* Math.cos(a) - normalizedVector[1]*Math.sin(a);
    let newy = normalizedVector[0]*Math.sin(a) + normalizedVector[1]*Math.cos(a);

    //AddFiredAmmo(humans[0].left, humans[0].top, worldMouseX, worldMouseY, 750, null);
    result[0] = initX + newx * 100;
    result[1] = initY + newy * 100;
    return result;
}

module.exports = Range;