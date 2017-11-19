const Stack = require('./Stack');

function findItems(idItem, size, inventory){
	let result = {};
	for (let i =0; i<inventory.stacks.length; i++){
		if(inventory.stacks[i]!==undefined&&inventory.stacks[i]!==null&&inventory.stacks[i].idItem===idItem){
			if (inventory.stacks[i].size>=size){
                result[i] = inventory.stacks[i];
                return result;
			}else{
                size -= inventory.stacks[i].size;
                result[i] = inventory.stacks[i];
			}
        }
    }
    return null;
}

function addStack (inventory, idItem, size, items){
	let array = new Object();
    array.isFull = false;
	//let inventory = inventories[humans[idHuman].idInventory];
	let sqlUtils = require('../../sql/utils')
	let idStack = sqlUtils.getId('stack');
	for (let i = 0; i<inventory.stacks.length; i++){
		if (inventory.stacks[i]!==undefined&&inventory.stacks[i]!==null&&inventory.stacks[i].idItem===idItem&&items[idItem].stackSize>inventory.stacks[i].size){
			let quantity = inventory.stacks[i].size+size - items[idItem].stackSize;
			if (quantity<=0){
				inventory.stacks[i].size += size;
				array[i] = inventory.stacks[i];
				return array;
			}else {
				inventory.stacks[i].size = items[idItem].stackSize;
				size = quantity;
				array[i] = inventory.stacks[i];
			}
		}
	}
	let newStack;
	for (let i = 0; i<inventory.stacks.length; i++){
		if (inventory.stacks[i] ===undefined||inventory.stacks[i] === null){
			if (size<=items[idItem].stackSize){
				newStack = new Stack({id:idStack, idItem:idItem, size:size});
				inventory.stacks[i] = newStack;
				array[i] = newStack;
				return array;
			}else{
				newStack = new Stack({id:idStack, idItem:idItem, size:items[idItem].stackSize});
				inventory.stacks[i] =newStack;
				array[i] = newStack;
				size -= items[idItem].stackSize;
			}
			
		}
	}
    array.isFull = true;
	return array;
}

function swapStack (inventory, idHuman, indexFrom, indexTo, items){
	let array={};
	if (indexFrom===indexTo) return array
	//let inventory = inventories[humans[idHuman].idInventory];
	let idItem;
	if(inventory.stacks[indexFrom]!==null&&inventory.stacks[indexFrom]!==undefined){ 
		idItem = inventory.stacks[indexFrom].idItem;
	}else{
		return;
	}
	if (inventory.stacks[indexFrom].idItem!==undefined){
		if (indexTo===-1){			
			//delete stacks[inventory.stacks[indexFrom].id];
			inventory.stacks[indexFrom] = null;
			array[indexFrom] = null;			
		}else if (inventory.stacks[indexTo]===undefined||inventory.stacks[indexTo]===null){
			array[indexTo]=inventory.stacks[indexFrom];
			inventory.stacks[indexTo]= inventory.stacks[indexFrom];
			inventory.stacks[indexFrom] = null;
			array[indexFrom] = null;
		}else if (inventory.stacks[indexTo].idItem===idItem&&inventory.stacks[indexTo].size<items[idItem].stackSize){
			let quantity = items[idItem].stackSize - (inventory.stacks[indexTo].size + inventory.stacks[indexFrom].size);
			if (quantity>0){
				inventory.stacks[indexTo].size += inventory.stacks[indexFrom].size;
				inventory.stacks[indexFrom]=null;
				array[indexTo] = inventory.stacks[indexTo];
				array[indexFrom] = null;
			}else{
				inventory.stacks[indexTo].size = items[idItem].stackSize;
				inventory.stacks[indexFrom].size = Math.abs(quantity);
				array[indexTo] = inventory.stacks[indexTo];
				array[indexFrom] = inventory.stacks[indexFrom];
			}	
		} else if (inventory.stacks[indexTo].idItem!==idItem){
			let tmp = inventory.stacks[indexTo];
			inventory.stacks[indexTo] = inventory.stacks[indexFrom];
			inventory.stacks[indexFrom] = tmp;
			array[indexTo] = inventory.stacks[indexTo];
			array[indexFrom] = inventory.stacks[indexFrom];
		}		
	}
	return array;
}
exports.findItems=findItems;
exports.addStack=addStack;
exports.swapStack=swapStack;