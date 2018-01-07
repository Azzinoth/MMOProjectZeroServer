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
module.exports = FiredAmmo;