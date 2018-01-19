const Resource = require('../Resource')
function Tree(id, mapItemId, typeId, location) {
    Resource.apply(this, arguments);
    this.lootChance = new Array(new Array(1, 6, 100));
}
Tree.prototype = Object.create(Resource.prototype);

module.exports = Tree;