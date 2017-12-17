const bubbleSort = require('../../utils/bubbleSort');
const stackUtils = require('../inventory/stackUtils');
function craftItem(inventory, stacks, recipe, items){
	let stacksId = inventory.stacks;
	let result = [];
	let isEnoughtItem = false;
    let isAvailableSpace = false;
	let isBreak;
/////////Check availability items in inventory by recipe
    for (let i = 0; i<recipe.ingredients.length; i++) {
        let amount = recipe.ingredients[i].amount;
        isEnoughtItem= false;
        for (let j = 0; j < stacksId.length; j++) {
            if (stacksId[j]!==null&&stacks[stacksId[j]].item!==null&&recipe.ingredients[i].typeId===stacks[stacksId[j]].item.typeId){
                if (stacks[stacksId[j]].size>amount){
                    isEnoughtItem = true;
                    break;
                }else if(stacks[stacksId[j]].size===amount){
                    isEnoughtItem = true;
                    break;
                }else if (stacks[stacksId[j]].size<amount){
                    amount -=stacks[stacksId[j]].size;
                    isAvailableSpace=true;
                }
            }
        }
        if (!isEnoughtItem) break;
    }
    if (!isEnoughtItem)  return 1;
/////////Check available space in inventory
    if (!isAvailableSpace){
        let stackSize = items[recipe.craftedTypeId].stackSize;
        let amount = recipe.outputAmount;
        for (let i = 0; i < stacksId.length; i++) {
            if (stacks[stacksId[i]].item===null){
                isAvailableSpace = true;
                break;
            }else if(stacks[stacksId[i]].item.typeId === recipe.craftedTypeId){
                if (stacks[stacksId[i]].size+amount<=stackSize){
                    isAvailableSpace = true;
                    break;
                }else if (stacks[stacksId[i]].size+amount>stackSize){
                    amount -=stacks[stacksId[i]].size+amount-stackSize
                }
            }
        }
    }
    if (!isAvailableSpace) return 2;
/////////////Get items from inventory and stacks by recipe
    let isMinusIngridient;
	for (let i = 0; i<recipe.ingredients.length; i++){
        isMinusIngridient = false;
		let indexStack = [];
		for (let j = 0; j<inventory.stacks.length; j++){
		    let stackId = inventory.stacks[j];
			//if (!isFullTmpStack)tmpStacks[j] = stacks[inventory.stacks[j]];
			if (stacks[stackId].item!==null&&stacks[stackId].item.typeId===recipe.ingredients[i].typeId){
				indexStack.push(stacks[stackId]);
			}
		}
		//isFullTmpStack = true;
		bubbleSort.bubbleSort(indexStack);
		let price = recipe.ingredients[i].amount;
		isBreak = false;
        let stackId;
		for(let j =0; j<indexStack.length;j++){
			for(let k=0; k<inventory.stacks.length;k++){
				if (indexStack[j].id===inventory.stacks[k]){
                   stackId = inventory.stacks[k];
					if (price<stacks[stackId].size){
                        stacks[stackId].size -= price;
                        result.push(stacks[stackId]);
						//result[k] = stacks[stackId];
						isBreak=true;
                        isMinusIngridient = true;
						break;
					}else if (price===stacks[stackId].size){
                        stacks[stackId].item = null;
                        stacks[stackId].size = null;
                        result.push(stacks[stackId]);
						//result[k] = stacks[stackId];
						isBreak=true;
                        isMinusIngridient = true;
						break;
					}else{
						price -= stacks[stackId].size;
                        stacks[stackId].item=null;
                        stacks[stackId].size=null;
                        result.push(stacks[stackId]);
						//result[k] = stacks[stackId];
						
					}
				}
			}
			if (isBreak) break;
		}
        if (!isMinusIngridient) return 3;
	}
    let tmp = stackUtils.addStack(inventory, stacks, recipe.craftedTypeId, recipe.outputAmount);
    for (let i = 0; i<tmp.length; i++){
        result.push(tmp[i]);
    }
	return result;
}
module.exports = craftItem;