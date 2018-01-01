const Animal = require('../Animal');
function Rabbit (id, location, isAlive, timeToResurrection, zoneId){
    Animal.apply(this, arguments);
    this.name = 'rabbit';
    this.zoneId = zoneId;
    this.speed = 32;
    this.health = 3;

}

Rabbit.prototype = Object.create(Animal.prototype);


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