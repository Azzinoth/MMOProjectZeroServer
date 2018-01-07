const Wall = require('../Wall')
function WoodWall(id, mapItemId, characterId) {
    Wall.apply(this, new Array(id, mapItemId, 3, characterId, 20));
}
WoodWall.prototype = Object.create(Wall.prototype);
module.exports = WoodWall;