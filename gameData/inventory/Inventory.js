const Lootable = require('../mapItem/buildingPart/Lootable');
const itemUtils = require('../item/itemUtils');
const utils = require('../../utils/bubbleSort');
function Inventory(id, size) {
  this.id = id;
  this.size = size;
  this.stacks = new Array(size);
}

Inventory.prototype.clear = function (allStacks) {
  for (let i = 0; i < this.stacks.length; i++) {
    if (allStacks[this.stacks[i]].item !== null) {
      allStacks[this.stacks[i]].item = null;
      allStacks[this.stacks[i]].size = null;
    }
  }
}

Inventory.prototype.addAllFromInventory = function (inventory, stacks) {
  let result = [];
  for (let i = 0; i < inventory.stacks.length; i++) {
		if (stacks[inventory.stacks[i]].item !== null){
      result = result.concat(this.addStack(stacks, stacks[inventory.stacks[i]]));
      result.push(stacks[inventory.stacks[i]]);
    }
  }
  return result;
}

Inventory.prototype.addStack = function (stacks, addStack) {
	let result = [];
  let stackId;
  for (let i = 0; i<this.stacks.length; i++){
    stackId = this.stacks[i];
    if (stacks[stackId].item!==null && stacks[stackId].item.typeId==addStack.item.typeId && stacks[stackId].item.stackSize>stacks[stackId].size){
      let quantity = stacks[stackId].size+addStack.size - stacks[stackId].item.stackSize;
      if (quantity<=0){
        stacks[stackId].size += addStack.size;
        // array[i] = stacks[stackId];
        result.push(stacks[stackId]);
        return result;
      }else {
        stacks[stackId].size = stacks[stackId].item.stackSize;
        addStack.size = quantity;
        // array[i] = stacks[stackId];
        result.push(stacks[stackId]);
      }
    }
  }

  for (let i = 0; i<this.stacks.length; i++){
    stackId = this.stacks[i];
    if (stacks[stackId].item === null) {

      stacks[stackId].item = addStack.item.copy();
      stacks[stackId].size = addStack.size;
      addStack.item = null;
      addStack.size= null;
      result.push(stacks[stackId]);
      return result;
    }
  }
  return result;
}

Inventory.prototype.addItem = function(stacks, typeId, size){
  let result = [];

    for (let i = 0; i<this.stacks.length; i++){
      let stackId = this.stacks[i];
      if (stacks[stackId].item!==null&&stacks[stackId].item.typeId==typeId&&stacks[stackId].item.stackSize>stacks[stackId].size){
        let quantity = stacks[stackId].size+size - stacks[stackId].item.stackSize;
        if (quantity<=0){
          stacks[stackId].size += size;
          // array[i] = stacks[stackId];
          result.push(stacks[stackId]);
          return result;
        }else {
          stacks[stackId].size = stacks[stackId].item.stackSize;
          size = quantity;
          // array[i] = stacks[stackId];
          result.push(stacks[stackId]);
        }
      }
    }

  let stackId;
  for (let i = 0; i<this.stacks.length; i++){
    stackId = this.stacks[i];
    if (stacks[stackId].item === null) {
      let obj = itemUtils.createItem(typeId);
      if (size <= obj.stackSize) {
        stacks[stackId].item = obj;
        stacks[stackId].size = size;

        //array[i] = stacks[stackId];
        result.push(stacks[stackId]);
        return result;
      } else {
        stacks[stackId].item = obj;
        stacks[stackId].size = obj.stackSize;

        //array[i] = stacks[stackId];
        result.push(stacks[stackId]);
        size -= obj.stackSize;
      }

    }
  }
  return result;
}
Inventory.prototype.removeItem = function(stacks, typeId, size){
  let result = [];
  let tmpQuantity=0;
  let tmpStacks = [];
  for(let i = 0; i<this.stacks.length; i++){
    if (stacks[this.stacks[i]].item!==null && stacks[this.stacks[i]].item.typeId===typeId){
      if (tmpStacks.length===0)tmpStacks.push(stacks[this.stacks[i]]);
      else {
        for (let j = 0; j < tmpStacks.length; j++) {
          if (tmpStacks[j].size > stacks[this.stacks[i]].size) {
            tmpStacks.splice(j, 0, stacks[this.stacks[i]]);
            break;
          }
          if (j === tmpStacks.length-1){
            tmpStacks.push(stacks[this.stacks[i]]);
            break;
          }
        }
      }
    }
  }
  for(let i = 0; i<tmpStacks.length; i++){
      if(tmpStacks[i].size>=size-tmpQuantity){
        tmpStacks[i].size-=(size-tmpQuantity);
        if (tmpStacks[i].size==0){
          tmpStacks[i].item = null;
          tmpStacks[i].size = null;
        }
        tmpQuantity=size;
        result.push(tmpStacks[i]);
        break;
      }else {
        tmpQuantity += tmpStacks[i].size;
        tmpStacks[i].size = null;
        tmpStacks[i].item = null;
        result.push(tmpStacks[i]);
      }
  }
  return result;
}
Inventory.prototype.findItems = function(typeId, stacks){
  let result = [];
  result[0] = 0;
  result[1] = [];
  for (let i =0; i<this.stacks.length; i++){
    if(stacks[this.stacks[i]].item!==null&&stacks[this.stacks[i]].item.typeId===typeId){
      result[0]+=stacks[this.stacks[i]].size;
      result[1].push(stacks[this.stacks[i]]);
    }
  }
  // if (result[1].length>1)result[1]=utils.bubbleSort(result[1]);
  return result;
}
Inventory.prototype.findOwner = function (data) {
  for (let key in data.characters){
    if (data.characters[key].inventoryId === this.id||
      data.characters[key].hotBarId === this.id ||
      data.characters[key].armorInventoryId === this.id) return data.characters[key];
  }
  for (let key in data.buildingParts){
    if (data.buildingParts[key] instanceof (Lootable) && data.buildingParts[key].inventoryId === this.id) return data.buildingParts[key];
  }
  for (let key in data.mapLoots){
    if (data.mapLoots[key].inventoryId === this.id) return data.mapLoots[key];
  }
  return null;
}
Inventory.prototype.availableFreeSpace=function(item, stacks){
  let result=0;
  for (let j =0; j<this.stacks.length; j++){
    if (stacks[this.stacks[j]].item===null){
      result+=item.stackSize;
    }else if(stacks[this.stacks[j]].item!==null&&stacks[this.stacks[j]].item.typeId===item.typeId){
      result+=item.stackSize - stacks[this.stacks[j]].size;
    }
  }
  return result;
}
module.exports = Inventory;
