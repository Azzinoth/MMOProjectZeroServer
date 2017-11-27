const Inventory = require('../inventory/Inventory') ;
const bubbleSort = require('../../utils/bubbleSort');
const stackUtils = require('../inventory/stackUtils');
function craftItem(data, inventory, stacks, recipe, characterId, items){
	let stacksId = inventory.stacks;
	//let tmpStacks = [stacksId.length];
	//let isEnought = false;
	//let isFullTmpStack = false;
	let result = {};
	let isEnoughtItem = false;
    let isAvailableSpace = false;
	let isBreak;
/////////Check availability items in inventory by recipe
    for (let i = 0; i<recipe.ingredients.length; i++) {
        let amount = recipe.ingredients[i].amount;
        isEnoughtItem= false;
        for (let j = 0; j < stacksId.length; j++) {
            if (stacksId[j]!==null&&recipe.ingredients[i].itemId===stacks[stacksId[j]].itemId){
                if (stacks[stacksId[j]].size>recipe.ingredients[i].amount){
                    isEnoughtItem = true;
                    break;
                }else if(stacks[stacksId[j]].size===recipe.ingredients[i].amount){
                    isEnoughtItem = true;
                    break;
                }else if (stacks[stacksId[j]].size<recipe.ingredients[i].amount){
                    amount -=stacks[stacksId[j]].size;
                    stacksId[j] = null;
                }
            }
        }
        if (!isEnoughtItem) break;
    }
    if (!isEnoughtItem) return;
/////////Check available space in inventory
    let stackSize = items[recipe.craftedItemId].stackSize;
    let amount = recipe.outputAmount;
    for (let i = 0; i < stacksId.length; i++) {
        if (stacksId[i]===null){
            isAvailableSpace = true;
            break;
        }else if(stacks[stacksId[i]].itemId === recipe.craftedItemId){
            if (stacks[stacksId[i]].size+amount<=stackSize){
                isAvailableSpace = true;
                break;
            }else if (stacks[stacksId[i]].size+amount>stackSize){
                amount -=stacks[stacksId[i]].size+amount-stackSize
            }
        }
    }
    if (!isAvailableSpace) return;
/////////////Get items from inventory and stacks by recipe
	for (let i = 0; i<recipe.ingredients.length; i++){
		let indexStack = [];
		for (let j = 0; j<inventory.stacks.length; j++){
			//if (!isFullTmpStack)tmpStacks[j] = stacks[inventory.stacks[j]];
			if (inventory.stacks[j]!==null && stacks[inventory.stacks[j]].itemId===recipe.ingredients[i].itemId){
				indexStack.push(stacks[inventory.stacks[j]]);
			}
		}
		//isFullTmpStack = true;
		bubbleSort.bubbleSort(indexStack);
		let price = recipe.ingredients[i].amount;
		isBreak = false;
		for(let j =0; j<indexStack.length;j++){
			for(k=0; k<inventory.stacks.length;k++){
				if (inventory.stacks[k]!==null && indexStack[j].id===inventory.stacks[k]){
                    let stackId = inventory.stacks[k];
					if (price<stacks[stackId].size){
                        stacks[stackId].size -= price;
						//isEnought = true;
						result[k] = stacks[stackId];
						isBreak=true;
						break;
					}else if (price===stacks[stackId].size){
                        inventory.stacks[k]=null;
                        delete stacks[stackId];
						//isEnought = true;
						result[k] = null;
						isBreak=true;
						break;
					}else{
						
						price -= stacks[stackId].size;
                        inventory.stacks[k]=null;
                        delete stacks[stackId];
						result[k] = null;
						
					}
				}
			}
			if (isBreak) break;
		}
		//if (!isEnought) return result = {};
	}
///////Add crafted item in inventory
	//let tmpInventory = new Inventory({id:inventory.inventoryId, size:inventory.size});
    //tmpInventory.stacks =tmpStacks ;
    let tmp = stackUtils.addStack(data, inventory, stacks, recipe.craftedItemId, recipe.outputAmount, items);
    //delete tmpInventory;
    //if (tmp.isFull)return result = {};
    for (let key in tmp){
    	//if (key!=='isFull'){
			//tmpStacks[key] = tmp[key];
            result[key] = tmp[key];
        //}
    }
	//inventory.stacks = tmpStacks;
	return result;
}
module.exports = craftItem;