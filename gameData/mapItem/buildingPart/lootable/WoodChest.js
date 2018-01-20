const Lootable = require('../Lootable')
function WoodChest(mapItemId, location, characterId, inventoryId) {
  Lootable.apply(this, new Array(23, mapItemId, 10, location, characterId, 5, inventoryId, 8));
}
WoodChest.prototype = Object.create(Lootable.prototype);
WoodChest.prototype.create = function (mapItemId, location, characterId, inventoryId) {
  return new WoodChest(mapItemId, location, characterId, inventoryId);
}
module.exports = WoodChest;