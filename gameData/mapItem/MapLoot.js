function MapLoot(mapItemId, location, inventoryId) {
  this.mapItemId = mapItemId;
  this.location = location;
  this.inventoryId = inventoryId;
  this.timeToDelete = 10000;
}
module.exports = MapLoot;