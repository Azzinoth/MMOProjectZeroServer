const Item = require('../Item')
function UnixItem(typeId, name, itemId) {
    Item.apply(this, arguments);
    this.itemId=itemId;
    this.stackSize = 1;
}
UnixItem.prototype = Object.create(Item.prototype);
module.exports = UnixItem;