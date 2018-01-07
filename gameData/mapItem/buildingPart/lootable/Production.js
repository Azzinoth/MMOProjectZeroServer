const Lootable = require('../Lootable')
function Production(id, mapItemId, typeId, characterId, durability, inventoryId) {
  Lootable.apply(this, arguments);
  this.preparingTime=null;
  this.isPreparing = false;
}
Production.prototype = Object.create(Lootable.prototype);
module.exports = Production;