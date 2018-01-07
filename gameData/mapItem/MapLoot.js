function MapLoot(mapItemId, left, top, inventoryId) {
  this.mapItemId = mapItemId;
  this.left = left;
  this.top = top;
  this.column = Math.floor(left/64);
  this.row = Math.floor(top/64);
  this.inventoryId = inventoryId;
  this.timeToDelete = 10000;
}
module.exports = MapLoot;