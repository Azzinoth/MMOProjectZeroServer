const Animal = require('../Animal');
function Rabbit (id, location){
    Animal.apply(this, arguments);
    this.name = 'rabbit';
    this.zone = this.randZone;
    this.speed = 300;
    this.health = 3;

}

Rabbit.prototype = Object.create(Animal.prototype);


Rabbit.prototype.randZone = function  (){
    let rand;
    let maxRand=null;
    let keyZone=null;
    for (let key in this.data.zones){
        if (this.data.zones.type==='forest'){
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
module.exports = Rabbit;