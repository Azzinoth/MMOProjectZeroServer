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
}
Animal.prototype = Object.create(Npc.prototype);

Animal.prototype.getZone = function  (){
    return this.zone;
}

Animal.prototype.chooseNewDestination = function (map, zones) {
    if (Math.random()<0.9) return null;

    if (this.destination===null)this.destination=new Location();
    this.destination.column = parseInt(Math.random() * (zones[this.zoneId].toColumn - zones[this.zoneId].fromColumn) + zones[this.zoneId].fromColumn);
    this.destination.row = parseInt(Math.random() * (zones[this.zoneId].toRow - zones[this.zoneId].fromRow) + zones[this.zoneId].fromRow);
    this.destination.top = parseInt(Math.random() * 64);
    this.destination.left = parseInt(Math.random() * 64);
    if (!map[this.destination.column][this.destination.row].movable) this.destination = null;
}
Animal.prototype.move = function (map) {

    if (this.destination!==null){
        let time = new Date().getTime();
        if (this.lastTick===null)this.lastTick=time;
        this.currentTick = time;
        this.timePassed += this.currentTick - this.lastTick;
        this.lastTick = time;

        if (this.path.length===0){
            let from = {column:this.location.column, row:this.location.row};
            let to = {column:this.destination.column, row:this.destination.row};
            if (from.column===to.column&&from.row===to.row){
                this.destination=null;
                return;
            }
            this.path = findPath.algoritmA(from, to, map);

        }

        this.targetX = this.path[0].column*64;
        this.targetY = this.path[0].row*64;
        this.distToFinal = Math.sqrt(Math.pow((this.targetX - this.location.left), 2) + Math.pow((this.targetY - this.location.top), 2));
        this.timeToFinal = this.distToFinal / this.speed * 1000;
        let tmpLeft = parseInt(this.location.left + (this.targetX - this.location.left) * (this.timePassed / this.timeToFinal));
        let tmpTop = parseInt(this.location.top + (this.targetY - this.location.top) * (this.timePassed / this.timeToFinal));



        if (this.destination!==null&&Math.floor(tmpLeft/64)===this.location.column&&
            Math.floor(tmpTop/64)===this.location.row){
            this.location.top = tmpTop;
            this.location.left = tmpLeft;
            return true;
        }else if (this.path.length>3&&!map[this.path[1].column][this.path[1].row].movable){

            let from = {column:this.location.column, row:this.location.row};
            let to = {column:this.destination.column, row:this.destination.row};
            // this.path.push({column:this.location.column, row:this.location.row+1});
            // this.path.push({column:this.location.column, row:this.location.row+1});
            this.path = findPath.algoritmA(from, to, map);
            if(this.path.length>0) {
                let time1 = new Date().getTime();
                this.lastTick = time1;
                this.timePassed=0;
                this.move();
                return true;
            }else{
                return false;
            }
        }else if(this.path.length===2&&!map[this.path[1].column][this.path[1].row].movable){
            this.destination = null;
            return false;
        }else{
            this.location.top = tmpTop;
            this.location.left = tmpLeft;
            this.location.column = this.path[0].column;
            this.location.row = this.path[0].row;
            this.path.splice(0,1);
            let time1 = new Date().getTime();
            this.lastTick = time1;
            this.timePassed=0;
            return true;
        }

        } else if (this.destination!==null&&this.location.column===this.destination.column&&this.location.row===this.destination.row) {
            this.destination =null;
            return true;
        }
    return false;
}


module.exports = Animal;