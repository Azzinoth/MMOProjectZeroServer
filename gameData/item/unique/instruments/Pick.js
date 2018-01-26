const Instruments = require('../Instruments');
function Pick(itemId) {
  Instruments.apply(this, new Array(15, 'INSTRUMENTS', itemId, 100));
  this.usableObjId = new Array (8, 9, 10);
}
Pick.prototype = Object.create(Instruments.prototype);
Pick.prototype.create = function (itemId) {
  return new Pick(itemId);
};
module.exports=Pick;