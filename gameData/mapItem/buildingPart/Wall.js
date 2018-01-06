const BuildingPart = require('../BuildingPart')
function Wall(id, mapItemId, typeId, characterId, durability) {
    BuildingPart.apply(this, arguments);
}
Wall.prototype = Object.create(BuildingPart.prototype);
module.exports = Wall;