const itemUtils = require('../item/itemUtils')

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
  for (let i = 0; i < inventory.stacks.length; i++) {
		if (stacks[inventory.stacks[i]].item !== null){
      this.addStack(stacks, stacks[inventory.stacks[i]]);
		}
  }
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
      stacks[stackId].item = addStack.item;
      stacks[stackId].size = addStack.size;
      result.push(stacks[stackId]);
      return result;
    }
  }
  return result;
}
module.exports = Inventory;
