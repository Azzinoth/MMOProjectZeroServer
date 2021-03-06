const Melee = require('../Melee');

function Spear(itemId) {
  Melee.apply(this, new Array(16, 'WEAPON', itemId, 100, 5, 32, null));
}

Spear.prototype = Object.create(Melee.prototype);
Spear.prototype.create = function (itemId) {
  return new Spear(itemId);
};

module.exports = Spear;