const Production = require('../Production')
function CampFire(mapItemId, location, characterId, inventoryId) {
  Production.apply(this, new Array(25, mapItemId, 7, location, characterId, 20, inventoryId, 6, 30));
}
CampFire.prototype = Object.create(Production.prototype);
CampFire.prototype.create = function (mapItemId, location, characterId, inventoryId) {
  return new CampFire(arguments);
}
module.exports = CampFire;