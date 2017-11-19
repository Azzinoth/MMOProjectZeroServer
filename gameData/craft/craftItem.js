const Inventory = require('../inventory/Inventory') ;
const bubbleSort = require('../../utils/bubbleSort');
const stackUtils = require('../inventory/stackUtils');
function craftItem(inventory, recipe, characterId, items){
	let stacks = inventory.stacks;
	let tmpStacks = [stacks.length];
	let isEnought = false;
	let isFullTmpStack = false;
	let result = {};
	let isBreak;
	for (let i = 0; i<recipe.ingredients.length; i++){
		let indexStack = [];
		for (let j = 0; j<stacks.length; j++){
			if (!isFullTmpStack)tmpStacks[j] = stacks[j];
			if (stacks[j]!==undefined && stacks[j]!==null && stacks[j].idItem===recipe.ingredients[i].itemId){
				indexStack.push(stacks[j]);
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

	let tmpInventory = new Inventory({id:inventory.idInventory, size:inventory.size});
    tmpInventory.stacks =tmpStacks ;
    let tmp = stackUtils.addStack(tmpInventory, recipe.craftedItemId, recipe.outputAmount, items);
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