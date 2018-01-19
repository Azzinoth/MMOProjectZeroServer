const BuildingPart = require('../BuildingPart')
function Lootable(id, mapItemId, typeId, location, characterId, durability, inventoryId, inventorySize) {
  BuildingPart.apply(this, arguments);
  this.inventoryId = inventoryId;
  this.inventorySize=inventorySize;
}
Lootable.prototype = Object.create(BuildingPart.prototype);
module.exports = Lootable;