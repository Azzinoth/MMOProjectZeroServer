function Npc (id, location, isAlive, timeToResurrection){
    this.id = id;
    this.name = null;
    this.size = null;
    this.speed = null;
    this.location = location;
    this.health = null;
    this.strength = null;
    this.isAlive = isAlive;
    this.timeToResurrection=timeToResurrection;
}
Npc.prototype.getSpeed = function () {
    return this.speed;
}
Npc.prototype.getHealth = function () {
    return this.health;
}
Npc.prototype.getStrength = function () {
    return this.strength;
}
Npc.prototype.getId = function () {
    return this.id;
}

module.exports = Npc;