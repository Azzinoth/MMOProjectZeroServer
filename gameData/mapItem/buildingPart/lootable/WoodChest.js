const Lootable = require('../Lootable')
function WoodChest(id, mapItemId, characterId, inventoryId) {
  Lootable.apply(this, new Array(id, mapItemId, 10, characterId, 5, inventoryId));
}
WoodChest.prototype = Object.create(Lootable.prototype);
module.exports = WoodChest;