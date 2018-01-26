const Weapon = require('../Weapon');
function Melee(typeId, name, itemId, durability, damage, fireRate, distance) {
  Weapon.apply(this, arguments);
  this.isFireRateReady = true;
  this.distance = distance;
}
Melee.prototype = Object.create(Weapon.prototype);

module.exports = Melee;