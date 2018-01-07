const Wall = require('../Wall')
function StoneWall(id, mapItemId, characterId) {
    Wall.apply(this, new Array(id, mapItemId, 4, characterId, 100));

}
StoneWall.prototype = Object.create(Wall.prototype);
module.exports = StoneWall;