const Door = require('../Door')
function WoodDoor(mapItemId, location, characterId) {
  Door.apply(this, new Array(27, mapItemId, 12, location, characterId, 18));
}
WoodDoor.prototype = Object.create(Door.prototype);
WoodDoor.prototype.create = function (mapItemId, location, characterId) {
  return new WoodDoor(mapItemId, location, characterId);
}

module.exports = WoodDoor;