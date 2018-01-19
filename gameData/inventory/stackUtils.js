const itemUtils = require('../item/itemUtils');
const utils = require('../../utils/bubbleSort');

function findItems(typeId, fromInventories, stacks){
    let result = [2];
    result[0] = 0;
    result[1] = [];
    for (let i = 0; i<fromInventories.length; i++){
      for (let j =0; j<fromInventories[i].stacks.length; j++){
        if(stacks[fromInventories[i].stacks[j]].item!==null&&stacks[fromInventories[i].stacks[j]].item.typeId===typeId){
          result[0]+=stacks[fromInventories[i].stacks[j]].size;
          result[1].push(stacks[fromInventories[i].stacks[j]]);
        }
      }
    }
    if (result[1].length>1)result[1]=utils.bubbleSort(result[1]);
    return result;
}
function checkFreeSpace(item, fromInventories, stacks){
    let result=0;
    for (let i = 0; i<fromInventories.length; i++){
      for (let j =0; j<fromInventories[i].stacks.length; j++){
        if (stacks[fromInventories[i].stacks[j]].item===null){
          result+=item.stackSize;
        }else if(stacks[fromInventories[i].stacks[j]].item!==null&&stacks[fromInventories[i].stacks[j]].item.typeId===item.typeId){
          result+=item.stackSize - stacks[fromInventories[i].stacks[j]].size;
        }
      }
    }

    return result;
}

function removeItems(size, arrayStacks){
  let result = [];

  let tmpQuantity=0;
  for(let i = 0; i<arrayStacks.length; i++){
      if (arrayStacks[i].size>=size-tmpQuantity){
          arrayStacks[i].size-=(size-tmpQuantity);
          if (arrayStacks[i].size==0){
              arrayStacks[i].item = null;
              arrayStacks[i].size = null;
          }
          tmpQuantity=size;
          result.push(arrayStacks[i]);
          break;
      }else{
          tmpQuantity+= arrayStacks[i].size;
          arrayStacks[i].size=null;
          arrayStacks[i].item = null;
          result.push(arrayStacks[i]);
      }
  }
  return result;
}

function addStack (toInventories, stacks, typeId, size){
	let result = [];

    let inventory = inventories[character.inventoryId];
    let hotBar = inventories[character.hotBarId];

	for (let i = 0; i<inventory.stacks.length; i++){
		let stackId = inventory.stacks[i];
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
    for (let i = 0; i<hotBar.stacks.length; i++){
        let stackId = hotBar.stacks[i];
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
	for (let i = 0; i<inventory.stacks.length; i++){
        stackId = inventory.stacks[i];
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
    for (let i = 0; i<hotBar.stacks.length; i++){
        stackId = hotBar.stacks[i];
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

function swapStack (inventoryFrom, inventoryTo, stacks, fromId, toId){
	let result = [];
	// let array={};
	let fromStackId = fromId;
    let toStackId;
    if (toId!==-1)toStackId = toId;
	if (fromId===toId&&inventoryFrom.id===inventoryTo.id) return result;
	let typeId;
	if(stacks[fromStackId].item!==null){
        typeId = stacks[fromStackId].item.typeId;
	}else{
		return 1;
	}
	if (stacks[fromStackId].item!==null){
		if (toId===-1){
            stacks[fromStackId].item=null;
            stacks[fromStackId].size=null;
            //array = stacks[fromStackId];
            result.push(stacks[fromStackId]);
		}else if (stacks[toStackId].item===null){


            //let obj = stacks[fromStackId].item;
            stacks[toStackId].item = stacks[fromStackId].item;
            stacks[toStackId].size = stacks[fromStackId].size;
            stacks[fromStackId].item = null;
            stacks[fromStackId].size = null;
            //array[indexTo]=stacks[toStackId];
			//array[indexFrom] = stacks[fromStackId];
            result.push(stacks[fromStackId]);
            result.push(stacks[toStackId]);
		}else if (stacks[toStackId].item.typeId===typeId&&stacks[toStackId].size<stacks[toStackId].item.stackSize){
			let quantity = stacks[toStackId].item.stackSize - (stacks[toStackId].size + stacks[fromStackId].size);
			if (quantity>0){
                stacks[toStackId].size += stacks[fromStackId].size;
				// array[indexTo] = stacks[toStackId];
                result.push(stacks[toStackId]);
                stacks[fromStackId].item = null;
                stacks[fromStackId].size = null;
                //array[indexFrom] = stacks[fromStackId];
                result.push(stacks[fromStackId]);

			}else{
                stacks[toStackId].size = stacks[toStackId].item.stackSize;
                stacks[fromStackId].size = Math.abs(quantity);
				// array[indexTo] = stacks[toStackId];
				// array[indexFrom] = stacks[fromStackId];
                result.push(stacks[toStackId]);
                result.push(stacks[fromStackId]);
			}	
		} else if (stacks[toStackId].item.typeId!==typeId){
			let tmpItem = stacks[toStackId].item;
            let tmpSize = stacks[toStackId].size;
			stacks[toStackId].item = stacks[fromStackId].item;
            stacks[toStackId].size = stacks[fromStackId].size;
            stacks[fromStackId].item = tmpItem;
            stacks[fromStackId].size = tmpSize;
            result.push(stacks[toStackId]);
            result.push(stacks[fromStackId]);
		}		
	}
	return result;
}
exports.findItems=findItems;
exports.addStack=addStack;
exports.swapStack=swapStack;
exports.removeItems = removeItems;
exports.checkFreeSpace = checkFreeSpace;