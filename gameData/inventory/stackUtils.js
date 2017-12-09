function findItems(itemId, size, inventory, stacks){
	let result = {};
	for (let i =0; i<inventory.stacks.length; i++){
		if(stacks[inventory.stacks[i]].itemId===itemId){
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

function addStack (inventory, stacks, itemId, size, items){
	let array = {};
    //array.isFull = false;
	//let inventory = inventories[humans[idHuman].idInventory];

	for (let i = 0; i<inventory.stacks.length; i++){
		let stackId = inventory.stacks[i];
		if (stacks[stackId].itemId==itemId&&items[itemId].stackSize>stacks[stackId].size){
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
	}
	//let newStack;
	let stackId;
	for (let i = 0; i<inventory.stacks.length; i++){
        stackId = inventory.stacks[i];
            if (stacks[stackId].itemId === null) {
                if (size <= items[itemId].stackSize) {
                    stacks[stackId].itemId = itemId;
                    stacks[stackId].size = size;
                    //newStack = stacks[stackId];

                    //stacks[inventory.stacks[i]] = newStack;
                    array[i] = stacks[stackId];
                    return array;
                } else {
                    stacks[stackId].itemId = itemId;
                    stacks[stackId].size = items[itemId].stackSize;

                    //newStack = stacks[stackId];
                    //inventory.stacks[i] = newStackId;
                    //stacks[stackId]=newStack;
                    array[i] = stacks[stackId];
                    size -= items[itemId].stackSize;
                }

            }
	}
	return array;
}

function swapStack (inventory, stacks, indexFrom, indexTo, items){
	let array={};
	let fromStackId = inventory.stacks[indexFrom];
    let toStackId;
    if (indexTo!==-1)toStackId = inventory.stacks[indexTo];
	if (indexFrom===indexTo) return array;
	let itemId;
	if(stacks[fromStackId].itemId!==null){
        itemId = stacks[fromStackId].itemId;
	}else{
		return 1;
	}
	if (stacks[fromStackId].itemId!==null){
		if (indexTo===-1){
			//inventory.stacks[indexFrom] = null;

            stacks[fromStackId].itemId=null;
            stacks[fromStackId].size=null;
            array[indexFrom] = stacks[fromStackId];
		}else if (stacks[toStackId].itemId===null){

            //toStackId= fromStackId;
            stacks[toStackId].itemId = stacks[fromStackId].itemId;
            stacks[toStackId].size = stacks[fromStackId].size;
            stacks[fromStackId].itemId = null;
            stacks[fromStackId].size = null;
            array[indexTo]=stacks[toStackId];
			array[indexFrom] = stacks[fromStackId];
		}else if (stacks[toStackId].itemId===itemId&&stacks[toStackId].size<items[itemId].stackSize){
			let quantity = items[itemId].stackSize - (stacks[toStackId].size + stacks[fromStackId].size);
			if (quantity>0){
                stacks[toStackId].size += stacks[fromStackId].size;
				//inventory.stacks[indexFrom]=null;
				array[indexTo] = stacks[toStackId];

                stacks[fromStackId].itemId = null;
                stacks[fromStackId].size = null;
                array[indexFrom] = stacks[fromStackId];
			}else{
                stacks[toStackId].size = items[itemId].stackSize;
                stacks[fromStackId].size = Math.abs(quantity);
				array[indexTo] = stacks[toStackId];
				array[indexFrom] = stacks[fromStackId];
			}	
		} else if (stacks[toStackId].itemId!==itemId){
			let tmpItem = stacks[toStackId].itemId;
            let tmpSize = stacks[toStackId].size;
			stacks[toStackId].itemId = stacks[fromStackId].itemId;
            stacks[toStackId].size = stacks[fromStackId].size;
            stacks[fromStackId].itemId = tmpItem;
            stacks[fromStackId].size = tmpSize;
			array[indexTo] = stacks[toStackId];
			array[indexFrom] = stacks[fromStackId];
		}		
	}
	return array;
}
exports.findItems=findItems;
exports.addStack=addStack;
exports.swapStack=swapStack;