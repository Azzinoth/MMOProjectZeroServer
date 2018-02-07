function Npc (id, location){
    this.id = id;
    this.name = null;
    this.size = null;
    this.speed = null;
    this.normalSpeed = null;
    this.location = location;
    this.health = null;
    this.currentHealth = null;
    this.strength = null;
    this.isAlive = true;
    this.timeToResurrection=null;
    this.type = null;
}

module.exports = Npc;