const Item = require('../Item')
function CommonItem(typeId, name, stackSize) {
    Item.apply(this, arguments);
}
CommonItem.prototype = Object.create(Item.prototype);
module.exports = CommonItem;