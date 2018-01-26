const UniqueItem = require('./UniqueItem');
function Instruments(typeId, name, itemId, durability) {
  UniqueItem.apply(this, new Array(typeId, name, itemId));
  this.durability = durability;
  this.usableObjId = [];

}
Instruments.prototype = Object.create(UniqueItem.prototype);

module.exports = Instruments;