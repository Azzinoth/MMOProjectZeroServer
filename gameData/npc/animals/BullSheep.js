const Animal = require('../Animal');

function BullSheep(id, location, zoneId) {
  Animal.apply(this, arguments);
  this.zoneId = zoneId;
  this.speed = 400;
  this.health = 340;
  this.strength = 180;
  this.lootChance = new Array(new Array(7, 8, 100), new Array(8, 3, 50));
}

BullSheep.prototype = Object.create(Animal.prototype);

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