const Passive = require('../Passive');

function BullSheep(id, location, zoneId) {
  Passive.apply(this, arguments);
  this.zoneId = zoneId;
  this.speed = 32;
  this.normalSpeed = 32;
  this.health = 50;
  this.currentHealth = 340;
  this.strength = 180;
  this.lootChance = new Array(new Array(8, 8, 100), new Array(10, 3, 50));
  this.type = 2;
}

BullSheep.prototype = Object.create(Passive.prototype);

BullSheep.prototype.randZone = function () {
  let rand;
  let maxRand = null;
  let keyZone = null;
  for (let key in this.data.zones) {
    if (this.data.zones.type === 'forest') {
      rand = Math.random;
      if (rand > maxRand) {
        maxRand = rand;
        keyZone = key;
      }
    }
  }
  if (keyZone !== null) {
    return this.data.zones[keyZone];
  }
  return null;
}
module.exports = BullSheep;