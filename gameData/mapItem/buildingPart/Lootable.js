const BuildingPart = require('../BuildingPart')
function Lootable(id, mapItemId, typeId, characterId, durability) {
  BuildingPart.apply(this, arguments);
}
Lootable.prototype = Object.create(BuildingPart.prototype);
module.exports = Lootable;