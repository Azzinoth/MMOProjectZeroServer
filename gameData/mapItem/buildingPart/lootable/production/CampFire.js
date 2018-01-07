const Production = require('../Production')
function CampFire(id, mapItemId, characterId, inventoryId) {
  Production.apply(this, new Array(id, mapItemId, 7, characterId, 20, inventoryId));
}
CampFire.prototype = Object.create(Production.prototype);
module.exports = CampFire;