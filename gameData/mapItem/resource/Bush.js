const Resource = require('../Resource')
function Bush(id, mapItemId, location) {
  Resource.apply(this, arguments);
  this.lootChance = new Array(new Array(17, 8, 100),new Array(18, 5, 85));
}
Bush.prototype = Object.create(Resource.prototype);

module.exports = Bush;