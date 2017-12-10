const Npc = require('./Npc');
function Animal (id, location){
    Npc.apply(this, arguments);
    this.zone = null;
    this.destination = null;

}
Animal.prototype = Object.create(Npc.prototype);

Animal.prototype.getZone = function  (){
    return this.zone;
}

Animal.prototype.chooseNewDestination = function () {
    if (Math.random()<0.9) return null;
    this.destination.column = parseInt(Math.random() * (this.zone.toColumn - this.zone.fromColumn) + this.zone.fromColumn);
    this.destination.row = parseInt(Math.random() * (this.zone.toRow - this.zone.fromRow) + this.zone.fromRow);
    this.destination.top = parseInt(Math.random() * 64);
    this.destination.left = parseInt(Math.random() * 64);
}


module.exports = Animal;