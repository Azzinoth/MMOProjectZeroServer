const Npc = require('./Npc');
const Location = require('../Location');
const findPath = require('../../utils/findPath')
function Animal (id, location){
    Npc.apply(this, arguments);
    this.zoneId = null;
    this.destination = null;
    this.path = [];
    this.currentTick=null;
    this.lastTick=null;
    this.timePassed=null;
    this.timeToFinal=null;
    this.distToFinal=null;
    this.targetX = null;
    this.targetY = null;
    this.fromX = -1;
    this.fromY = -1;
    this.isMovement = false;

}
Animal.prototype = Object.create(Npc.prototype);

Animal.prototype.getZone = function  (){
    return this.zone;
}

Animal.prototype.chooseNewDestination = function (map, zones) {
    if (Math.random()<0.999) return null;

    if (this.destination===null)this.destination=new Location();
    this.destination.column = parseInt(Math.random() * (zones[this.zoneId].toColumn - zones[this.zoneId].fromColumn) + zones[this.zoneId].fromColumn);
    this.destination.row = parseInt(Math.random() * (zones[this.zoneId].toRow - zones[this.zoneId].fromRow) + zones[this.zoneId].fromRow);
    this.destination.top = parseInt(Math.random() * 64);
    this.destination.left = parseInt(Math.random() * 64);
    if (!map[this.destination.column][this.destination.row].movable||(this.destination.column===this.location.column&&this.destination.row===this.location.row)) this.destination = null;
}
Animal.prototype.getCurrentTimeMS = function () {
    return new Date().getTime();
}
Animal.prototype.initMovement = function () {
    if (this.isMovement && this.path.length == 0) return;

    this.fromX = this.location.left;
    this.fromY = this.location.top;
    this.targetX = Math.floor(this.path[0].column * 64);
    this.targetY = Math.floor(this.path[0].row * 64);

    this.distToFinal = Math.sqrt(Math.pow((this.targetX - this.fromX), 2) + Math.pow((this.targetY - this.fromY), 2));
    this.timeToFinal = this.distToFinal / this.speed * 1000;
    this.timePassed = 0;

    this.currentTick = this.getCurrentTimeMS();
    this.lastTick = this.getCurrentTimeMS();

    this.isMovement = true;
}
Animal.prototype.findPath = function (map) {
    let from = {column:this.location.column, row:this.location.row};
    let to = {column:this.destination.column, row:this.destination.row};
    this.path = findPath.algoritmA(from, to, map);
    if (this.path.length===0){
        this.destination=null;
    }
}
Animal.prototype.move = function () {



        if (!this.isMovement) return 0;

        this.currentTick = this.getCurrentTimeMS();
        this.timePassed += this.currentTick - this.lastTick;
        this.lastTick = this.getCurrentTimeMS();

        this.location.left = parseInt(this.fromX + (this.targetX - this.fromX) * (this.timePassed / this.timeToFinal));
        this.location.top = parseInt(this.fromY + (this.targetY - this.fromY) * (this.timePassed / this.timeToFinal));

        if (this.timePassed > this.timeToFinal) {
            // correction
            this.location.left = parseInt(this.targetX);
            this.location.top = parseInt(this.targetY);

            this.location.column = Math.floor(this.location.left / 64);
            this.location.row = Math.floor(this.location.top / 64);

            this.path.splice(0, 1);
            this.isMovement = false;

            if (this.path.length !== 0) {
                this.initMovement();
            }else{
                this.destination = null;
            }
            return 1;

        }else {
            return 2;
        }
}


module.exports = Animal;