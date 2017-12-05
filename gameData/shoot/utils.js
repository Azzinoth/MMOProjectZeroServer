

function fire(ammo){
    ammo.distToFinal = Math.sqrt(Math.pow(ammo.initialX - ammo.finalX, 2) + Math.pow(initialY - finalY, 2));
    this.timeToFinal = this.distToFinal / this.speedPerSec * 1000;
    this.currentTick = getCurrentTimeMS();
    this.timePassed += this.currentTick - this.lastTick;
    this.lastTick = getCurrentTimeMS();

    this.x = parseInt(this.initialX + (this.finalX - this.initialX) * (this.timePassed / this.timeToFinal));
    this.y = parseInt(this.initialY + (this.finalY - this.initialY) * (this.timePassed / this.timeToFinal));

    if (this.timePassed > this.timeToFinal) this.active = false;
}
exports.fire = fire;