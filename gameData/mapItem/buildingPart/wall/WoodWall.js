const Wall = require('../Wall')
function WoodWall(id, mapItemId, typeId, characterId) {
    Wall.apply(this, new Array(id, mapItemId, typeId, characterId, 20));
}
WoodWall.prototype = Object.create(Wall.prototype);
module.exports = WoodWall;