const Range = require('../Range');
function Bow(itemId) {
    Range.apply(this, new Array(5, 'WEAPON', itemId, 6, 10, 2, 15, null, 500, 3000, 50, 50));//typeId, name, itemId, ammoId, durability, damage, accuracy(more better), fireRate, distance, reloadTime, magazineSize, currentMagazine
}

Bow.prototype = Object.create(Range.prototype);
Bow.prototype.create = function (itemId) {
  return new Bow(itemId);
}
Bow.prototype.copy = function () {
  let obj = new Bow(this.itemId);
  obj.durability = this.durability;
  obj.currentMagazine = this.currentMagazine;
  return obj;
}
module.exports=Bow;