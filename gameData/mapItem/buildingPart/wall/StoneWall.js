const Wall = require('../Wall')
function StoneWall(mapItemId, location, characterId) {
    Wall.apply(this, new Array(26, mapItemId, 4, location, characterId, 100));
}
StoneWall.prototype = Object.create(Wall.prototype);
StoneWall.prototype.create = function (mapItemId, location, characterId) {
  return new StoneWall(mapItemId, location, characterId);
}
module.exports = StoneWall;