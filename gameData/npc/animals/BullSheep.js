const Animal = require('../Animal');
function BullSheep (id, location){
    Animal.apply(this, arguments);
    this.name = 'bullsheep';
    this.zone = this.randZone;
    this.speed = 400;
    this.health = 340;
    this.strength = 180;
}

BullSheep.prototype = Object.create(Animal.prototype);


BullSheep.prototype.randZone = function  (){
    let rand;
    let maxRand=null;
    let keyZone=null;
    for (let key in this.data.zones){
        if (this.data.zones.type==='rocks'){
            rand=Math.random;
            if (rand>maxRand){
                maxRand = rand;
                keyZone = key;
            }
        }
    }
    if (keyZone!==null){
        return this.data.zones[keyZone];
    }
    return null;
}
module.exports = BullSheep;