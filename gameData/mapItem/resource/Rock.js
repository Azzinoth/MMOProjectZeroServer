const Resource = require('../Resource')
function Rock(id, mapItemId, location) {
    Resource.apply(this, arguments);
    this.lootChance = new Array(new Array(2, 6, 100));
}
Rock.prototype = Object.create(Resource.prototype);

module.exports = Rock;