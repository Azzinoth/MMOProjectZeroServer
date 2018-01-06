const Wall = require('../Wall')
function StoneWall(id, mapItemId, typeId, characterId) {
    Wall.apply(this, new Array(id, mapItemId, typeId, characterId, 100));

}
StoneWall.prototype = Object.create(Wall.prototype);
module.exports = StoneWall;