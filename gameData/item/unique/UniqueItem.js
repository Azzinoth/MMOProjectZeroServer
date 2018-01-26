const Item = require('../Item')
function UniqueItem(typeId, name, itemId) {
    Item.apply(this, arguments);
    this.itemId=itemId;
    this.stackSize = 1;
}
UniqueItem.prototype = Object.create(Item.prototype);
module.exports = UniqueItem;