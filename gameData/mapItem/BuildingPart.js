const MapItem = require('./MapItem')
function BuildingPart(id, mapItemId, typeId, location, characterId, durability) {
    MapItem.apply(this, arguments);
    this.characterId = characterId;
    this.durability = durability;

}
BuildingPart.prototype = Object.create(MapItem.prototype);
module.exports = BuildingPart;