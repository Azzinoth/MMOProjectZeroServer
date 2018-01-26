const Wall = require('../Wall')
function WoodWall(mapItemId, location, characterId) {
    Wall.apply(this, new Array(22, mapItemId, 3, location, characterId, 20));
}
WoodWall.prototype = Object.create(Wall.prototype);
WoodWall.prototype.create = function (mapItemId, location, characterId) {
  return new WoodWall(mapItemId, location, characterId);
}
module.exports = WoodWall;