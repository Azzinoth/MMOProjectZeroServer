const UniqueItem = require('./UniqueItem');
function Weapon(typeId, name, itemId, ammoId, durability, damage, accuracy, fireRate) {
    UniqueItem.apply(this, new Array(typeId, name, itemId));
    this.ammoId = ammoId;
    this.durability = durability;
    this.damage = damage;
    this.accuracy = accuracy;
    this.fireRate = fireRate;
}
Weapon.prototype = Object.create(UniqueItem.prototype);

module.exports = Weapon;