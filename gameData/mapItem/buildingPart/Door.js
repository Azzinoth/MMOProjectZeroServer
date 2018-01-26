const BuildingPart = require('../BuildingPart')
function Door(id, mapItemId, typeId, location, characterId, durability) {
  BuildingPart.apply(this, arguments);
}
Door.prototype = Object.create(BuildingPart.prototype);

module.exports = Door;