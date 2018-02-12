const Npc = require('./Npc');
const Location = require('../Location');
const findPath = require('../../utils/findPath');
const itemUtils = require('../item/itemUtils');
const getFinalCoord = require ('../../utils/finalCoordByDist');
const data = require ('../../gameData/data')
function Animal(id, location) {
  Npc.apply(this, arguments);
  this.zoneId = null;
  this.destination = null;
  this.path = [];
  this.lastTick = null;
  this.lootChance = null; ///lootChance array with itemId, quantity, chance
  // this.isAction = false;
  // this.isStay = false;
  this.tick = 0;
  this.stage = 0; //0-decide ,1-stay, 2-walk, 3-fear, 4-chase, 5-attack
  this.stayTick = null;
}

Animal.prototype = Object.create(Npc.prototype);

Animal.prototype.animalTick = function () {
  let result = null;//1 - npc data, 2 - npc move
  this.tick++;
  if (this.tick>100) this.tick=0;

  if (!this.isAlive){
    this.timeToResurrection--;
    if (this.timeToResurrection <= 0) {
      this.resurrect();
      result = 1;
    }
    return result;
  }

  if (this.stage===0){
    if (Math.random()>0.5){
      this.chooseNewDestination();
      this.move();
      this.stage = 2;
      result = 2;
    }else{
      this.stop();
      this.stage=1;
      this.stayTick=200;
      result = 2;
    }
  }else if (this.stage===1){
    this.stayTick--;
    if (this.stayTick<=0){
      this.stage = 0;
    }
  }else if (this.stage===2){
    if (this.path.length>0){
      this.move();
    }else{
      this.stage=0;
    }
  }

  // if (this.destination !== null&&this.path.length===0){
  //   this.findPath(map);
  //   result = 2;
  // }
  return result;
};

Animal.prototype.chooseNewDestination = function () {
  this.destination = new Location();
  this.destination.column = parseInt(Math.random() * (data.zones[this.zoneId].toColumn - data.zones[this.zoneId].fromColumn) + data.zones[this.zoneId].fromColumn);
  this.destination.row = parseInt(Math.random() * (data.zones[this.zoneId].toRow - data.zones[this.zoneId].fromRow) + data.zones[this.zoneId].fromRow);
  this.destination.top = parseInt(this.destination.column * 64+32);
  this.destination.left = parseInt(this.destination.row * 64+32);
  this.path = [];
  if (this.destination.column === this.location.column && this.destination.row === this.location.row) this.destination = null;
};

// Animal.prototype.getCurrentTimeMS = function () {
//   return new Date().getTime();
// };

Animal.prototype.move = function () {
  if (this.path.length===0&&this.destination!==null){
    this.findPath();
    //return;
  }
  if (this.path.length===0)return;
  if (this.lastTick===null){
    this.lastTick = new Date().getTime();
    return;
  }

  if (this.speed===null) this.speed=this.normalSpeed;
  let timePassed = (new Date().getTime() - this.lastTick)/1000;
  this.lastTick = new Date().getTime();
  let dist = timePassed*this.speed;
  let targetX = this.path[0].column*64+7;
  let targetY = this.path[0].row*64+7;
  let finalCoord = getFinalCoord(this.location.left, this.location.top, targetX, targetY, dist);
  let isTPtoFinalX = false;
  let isTPtoFinalY = false;
  if (this.location.left>=targetX){
    if (finalCoord[0]<=targetX){
      isTPtoFinalX = true;
    }
  }else{
    if (finalCoord[0]>targetX){
      isTPtoFinalX = true;
    }
  }
  if (this.location.top>=targetY){
    if (finalCoord[1]<=targetY){
      isTPtoFinalY = true;
    }
  }else{
    if (finalCoord[1]>targetY){
      isTPtoFinalY = true;
    }
  }

  if (isTPtoFinalX&&isTPtoFinalY){
    this.location.left = targetX;
    this.location.top = targetY;
    this.path.splice(0, 1);
    if (this.path.length===0){
      this.stop();
    }else if (!data.getMap()[this.path[0].column][this.path[0].row].movable) {
      this.findPath();
    }
  }else{
    this.location.column = Math.floor(finalCoord[0]/64);
    this.location.row = Math.floor(finalCoord[1]/64);
    this.location.left = finalCoord[0];
    this.location.top = finalCoord[1];
  }
};
Animal.prototype.stop = function () {
  this.path=[];
  this.destination = null;
  this.lastTick = null;
  this.speed = this.normalSpeed;
};

Animal.prototype.findPath = function () {
  let from = {column: this.location.column, row: this.location.row};
  let to = {column: this.destination.column, row: this.destination.row};
  this.path = findPath.algoritmA(from, to, data.getMap());
  if (this.path.length === 0) {
    this.stop();
    this.stage = 0;
  }
};
Animal.prototype.dead = function () {
  this.isAlive = false;
  this.location.column = null;
  this.location.row = null;
  this.location.top = null;
  this.location.left = null;
  this.timeToResurrection = 500;
  this.destination = null;
  this.path = [];
  this.lastTick = null;
};

Animal.prototype.resurrect = function () {
  this.location.column = parseInt(Math.floor(Math.random() * (data.zones[this.zoneId].toColumn - data.zones[this.zoneId].fromColumn) + data.zones[this.zoneId].fromColumn));
  this.location.row = parseInt(Math.floor(Math.random() * (data.zones[this.zoneId].toRow - data.zones[this.zoneId].fromRow) + data.zones[this.zoneId].fromRow));
  this.location.top = parseInt(Math.random() * 64);
  this.location.left = parseInt(Math.random() * 64);
  this.health = this.currentHealth;
  this.isAlive = true;
  this.timeToResurrection = null;
  this.destination = null;
  this.path = [];
  this.lastTick = null;
};

Animal.prototype.getLoot = function () {
  if (this.lootChance === null) return;
  let inventoryId = data.createInventory(this.lootChance.length);
  for (let i = 0; i < this.lootChance.length; i++) {
    let rand = Math.floor(Math.random() * (101));
    if (rand <= this.lootChance[i][2]) {
      data.stacks[data.inventories[inventoryId].stacks[i]].item = itemUtils.createItem(this.lootChance[i][0]);
      data.stacks[data.inventories[inventoryId].stacks[i]].size = this.lootChance[i][1];
    }
  }
  return inventoryId;
};

module.exports = Animal;