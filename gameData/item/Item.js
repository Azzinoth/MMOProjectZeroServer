
function Item(typeId, typeName, stackSize) {
    this.typeId = typeId;
    this.typeName = typeName;
    this.stackSize = stackSize;
}

Item.prototype.create = function () {
  return new Item(this.typeId, this.typeName, this.stackSize);
}
Item.prototype.copy = function () {
  return new Item(this.typeId, this.typeName, this.stackSize);
}
module.exports = Item;