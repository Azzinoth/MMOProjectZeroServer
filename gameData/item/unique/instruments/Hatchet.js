const Instruments = require('../Instruments');
function Hatchet(itemId) {
  Instruments.apply(this, new Array(14, 'INSTRUMENTS', itemId, 100));
  this.usableObjId = new Array (15, 16, 5);
}
Hatchet.prototype = Object.create(Instruments.prototype);
Hatchet.prototype.create = function (itemId) {
  return new Hatchet(itemId);
};
module.exports=Hatchet;