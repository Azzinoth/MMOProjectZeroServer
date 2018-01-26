const Door = require('../Door')
function StoneDoor(mapItemId, location, characterId) {
  Door.apply(this, new Array(28, mapItemId, 13, location, characterId, 88));
}

StoneDoor.prototype = Object.create(Door.prototype);
StoneDoor.prototype.create = function (mapItemId, location, characterId) {
  return new StoneDoor(mapItemId, location, characterId);
}
module.exports = StoneDoor;