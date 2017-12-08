function FiredAmmo() {
    this.weaponId = 0;
    this.characterId = 0;
    this.initialX = 0;
    this.initialY = 0;

    this.finalX = 0;
    this.finalY = 0;

    this.speedPerSec = 0;
    this.distToFinal = 0;
    this.timeToFinal = 0;
    this.timePassed = 0;

    this.active = false;
    this.currentTick = 0;
    this.lastTick = 0;
}
let FiredAmmoProto = {
    active: false,
    ammoId: null,
    characterId: null,
    x: 0,
    y: 0,
    initialX: 0,
    initialY: 0,
    finalX: 0,
    finalY: 0,

    speedPerSec: 0,
    timeToFinal: 0,
    distToFinal: 0,
    timePassed: 0,

    currentTick: 0,
    lastTick: 0
}
module.exports = FiredAmmo;