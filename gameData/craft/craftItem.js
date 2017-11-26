const Inventory = require('../inventory/Inventory') ;
const bubbleSort = require('../../utils/bubbleSort');
const stackUtils = require('../inventory/stackUtils');
function craftItem(data, inventory, stacks, recipe, characterId, items){
	let stacksId = inventory.stacks;
	let tmpStacks = [stacksId.length];
	let isEnought = false;
	let isFullTmpStack = false;
	let result = {};
	let isBreak;
	for (let i = 0; i<recipe.ingredients.length; i++){
		let indexStack = [];
		for (let j = 0; j<stacksId.length; j++){
			if (!isFullTmpStack)tmpStacks[j] = stacks[stacksId[j]];
			if (stacksId[j]!==null && stacks[stacksId[j]].itemId===recipe.ingredients[i].itemId){
				indexStack.push(stacks[stacksId[j]]);
			}
		}
		isFullTmpStack = true;
		bubbleSort.bubbleSort(indexStack);
		let price = recipe.ingredients[i].amount;
		isBreak = false;
		for(let j =0; j<indexStack.length;j++){
			for(k=0; k<tmpStacks.length;k++){
				if (tmpStacks[k]!==undefined && tmpStacks[k]!==null && indexStack[j].id===tmpStacks[k].id){
					if (price<tmpStacks[k].size){
						tmpStacks[k].size -= price;
						isEnought = true;
						result[k] = tmpStacks[k];
						isBreak=true;
						break;
					}else if (price===tmpStacks[k].size){
						tmpStacks[k] = null;
						isEnought = true;
						result[k] = tmpStacks[k];
						isBreak=true;
						break;
					}else{
						
						price -= tmpStacks[k].size;
						tmpStacks[k] = null;
						result[k] = tmpStacks[k];
						
					}
				}
			}
			if (isBreak) break;
		}
		if (!isEnought) return result = {};
	}

	let tmpInventory = new Inventory({id:inventory.inventoryId, size:inventory.size});
    tmpInventory.stacks =tmpStacks ;
    let tmp = stackUtils.addStack(data, tmpInventory, recipe.craftedItemId, recipe.outputAmount, items);
    delete tmpInventory;
    if (tmp.isFull)return result = {};
    for (let key in tmp){
    	if (key!=='isFull'){
			tmpStacks[key] = tmp[key];
            result[key] = tmp[key];
        }
    }
	inventory.stacks = tmpStacks;
	return result;
}
module.exports = craftItem;