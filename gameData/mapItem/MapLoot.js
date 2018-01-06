const MapItem = require('./MapItem');
function MapLoot(id, mapItemId) {
  MapItem.apply(this, arguments);
  this.typeId = null;
  this.mapInventoryId = null;
  this.timeToDelete = 10000;
  //this.type = type;
}
MapLoot.prototype = Object.create(MapItem.prototype);
module.exports = MapLoot;