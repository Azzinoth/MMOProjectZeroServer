const UniqueItem = require('./UniqueItem');
function Weapon(typeId, name, itemId, durability, damage, distance, fireRate) {
    UniqueItem.apply(this, new Array(typeId, name, itemId));
    this.durability = durability;
    this.damage = damage;
    this.distance = distance;
    this.fireRate = fireRate;
}
Weapon.prototype = Object.create(UniqueItem.prototype);

module.exports = Weapon;