const BuildingPart = require('../BuildingPart')
function Lootable(id, mapItemId, typeId, characterId, durability, inventoryId) {
  BuildingPart.apply(this, arguments);
  this.inventoryId = inventoryId
}
Lootable.prototype = Object.create(BuildingPart.prototype);
module.exports = Lootable;