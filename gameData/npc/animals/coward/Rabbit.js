const Coward = require('../Coward');
function Rabbit (id, location, zoneId){
  Coward.apply(this, arguments);
    this.zoneId = zoneId;
    this.normalSpeed = 64;
    this.speed = 64;
    this.health = 3;
    this.currentHealth = 3;
    this.lootChance = new Array(new Array(8, 2, 100), new Array(10, 1, 50));
    this.type = 1;
}

Rabbit.prototype = Object.create(Coward.prototype);


Rabbit.prototype.randZone = function  (zones){
    let rand;
    let maxRand=null;
    let keyZone=null;
    for (let key in zones){
        if (zones[key].type==='forest'){
            rand=Math.random;
            if (rand>maxRand){
                maxRand = rand;
                keyZone = key;
            }
        }
    }
    if (keyZone!==null){
        this.zoneId= zones[keyZone].id;
        return this.zoneId;
    }
    return null;
}
module.exports = Rabbit;