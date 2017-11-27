const Stack = require('./Stack');

function findItems(itemId, size, inventory, stacks){
	let result = {};
	for (let i =0; i<inventory.stacks.length; i++){
		if(inventory.stacks[i]!==null&&stacks[inventory.stacks[i]].itemId===itemId){
			if (stacks[inventory.stacks[i]].size>=size){
                result[i] = stacks[inventory.stacks[i]];
                return result;
			}else{
                size -= stacks[inventory.stacks[i]].size;
                result[i] = stacks[inventory.stacks[i]];
			}
        }
    }
    return null;
}

function addStack (data, inventory, stacks, itemId, size, items){
	let array = {};
    //array.isFull = false;
	//let inventory = inventories[humans[idHuman].idInventory];

	for (let i = 0; i<inventory.stacks.length; i++){
		//for (let key in stacks){
		let stackId = inventory.stacks[i];
		if (inventory.stacks[i]!==null&&stacks[stackId].itemId==itemId&&items[itemId].stackSize>stacks[stackId].size){
			let quantity = stacks[stackId].size+size - items[itemId].stackSize;
			if (quantity<=0){
				stacks[stackId].size += size;
				array[i] = stacks[stackId];
				return array;
			}else {
				stacks[stackId].size = items[itemId].stackSize;
				size = quantity;
				array[i] = stacks[stackId];
			}
		}
       // }
	}
	let newStack;
    let newStackId;
	for (let i = 0; i<inventory.stacks.length; i++){
        //for (let key in stacks) {
        //let stackId = inventory.stacks[i];
            if (inventory.stacks[i] === null) {
                if (size <= items[itemId].stackSize) {
                    newStackId = data.getId('stack');
                    newStack = new Stack({id: newStackId, itemId: itemId, size: size, inventoryId:inventory.id});
                    inventory.stacks[i] = newStackId;
                    stacks[newStackId] = newStack;
                    array[i] = newStack;
                    return array;
                } else {
                    newStackId = data.getId('stack');
                    newStack = new Stack({id: newStackId, itemId: itemId, size: items[itemId].stackSize, inventoryId:inventory.id});
                    inventory.stacks[i] = newStackId;
                    stacks[newStackId]=newStack;
                    array[i] = newStack;
                    size -= items[itemId].stackSize;
                }

            }
       // }

	}
    //array.isFull = true;
	return array;
}

function swapStack (inventory, stacks, idHuman, indexFrom, indexTo, items){
	let array={};
	if (indexFrom===indexTo) return array;
	//let inventory = inventories[humans[idHuman].idInventory];
	let itemId;
	if(inventory.stacks[indexFrom]!==null){
        itemId = stacks[inventory.stacks[indexFrom]].itemId;
	}else{
		return;
	}
	if (stacks[inventory.stacks[indexFrom]].itemId!==undefined){
		if (indexTo===-1){			
			//delete stacks[inventory.stacks[indexFrom].id];
			inventory.stacks[indexFrom] = null;
			array[indexFrom] = null;
            delete stacks[inventory.stacks[indexFrom]];
		}else if (inventory.stacks[indexTo]===null){
			array[indexTo]=stacks[inventory.stacks[indexFrom]];
			inventory.stacks[indexTo]= inventory.stacks[indexFrom];
			inventory.stacks[indexFrom] = null;
			array[indexFrom] = null;
            delete stacks[inventory.stacks[indexFrom]];
		}else if (stacks[inventory.stacks[indexTo]].itemId===itemId&&stacks[inventory.stacks[indexTo]].size<items[itemId].stackSize){
			let quantity = items[itemId].stackSize - (stacks[inventory.stacks[indexTo]].size + stacks[inventory.stacks[indexFrom]].size);
			if (quantity>0){
                stacks[inventory.stacks[indexTo]].size += stacks[inventory.stacks[indexFrom]].size;
				inventory.stacks[indexFrom]=null;
				array[indexTo] = stacks[inventory.stacks[indexTo]];
				array[indexFrom] = null;
                delete stacks[inventory.stacks[indexFrom]];
			}else{
                stacks[inventory.stacks[indexTo]].size = items[itemId].stackSize;
                stacks[inventory.stacks[indexFrom]].size = Math.abs(quantity);
				array[indexTo] = stacks[inventory.stacks[indexTo]];
				array[indexFrom] = stacks[inventory.stacks[indexFrom]];
			}	
		} else if (stacks[inventory.stacks[indexTo]].itemId!==itemId){
			let tmp = inventory.stacks[indexTo];
			inventory.stacks[indexTo] = inventory.stacks[indexFrom];
			inventory.stacks[indexFrom] = tmp;
			array[indexTo] = stacks[inventory.stacks[indexTo]];
			array[indexFrom] = stacks[inventory.stacks[indexFrom]];
		}		
	}
	return array;
}
exports.findItems=findItems;
exports.addStack=addStack;
exports.swapStack=swapStack;