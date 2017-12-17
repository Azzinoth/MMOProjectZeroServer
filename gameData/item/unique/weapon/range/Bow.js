const Range = require('../Range');
function Bow(typeId, itemId) {
    Range.apply(this, new Array(typeId, 'weapon', itemId, 6, 10, 2, 30, null, 500, 3000, 1, 0));//typeId, name, itemId, ammoId, durability, damage, accuracy(more better), fireRate, distance, reloadTime, magazineSize, currentMagazine
}

Bow.prototype = Object.create(Range.prototype);
module.exports=Bow;