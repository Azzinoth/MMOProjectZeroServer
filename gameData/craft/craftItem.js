function craftItem(inventory, stacks, recipe, items){
	let result = [];
	let isEnoughtItem = false;
	let resourceForCraft = [];
/////////Check availability items in inventory by recipe

    for (let i = 0; i<recipe.ingredients.length; i++) {
        let findItems = inventory.findItems(recipe.ingredients[i].typeId, stacks);
        let amount = recipe.ingredients[i].amount;
        isEnoughtItem= false;
        if (findItems[0]<amount)break;
        resourceForCraft.push(findItems[1]);
        isEnoughtItem= true;
    }
  //resourceForCraft = bubbleSort.bubbleSort(resourceForCraft);
    if (!isEnoughtItem)  return 1;
/////////Check available space in inventory
    let freeSpace = inventory.availableFreeSpace(items[recipe.craftedTypeId], stacks);

    if (freeSpace<recipe.outputAmount) return 2;

/////////////Get items from inventory and stacks by recipe
	for (let i = 0; i<recipe.ingredients.length; i++){
    let remove = inventory.removeItem(stacks, recipe.ingredients[i].typeId, recipe.ingredients[i].amount);
    result = result.concat(remove);
	}
  // let tmp = inventory.addStack(inventories, character, stacks, recipe.craftedTypeId, recipe.outputAmount, );
  // for (let i = 0; i<tmp.length; i++){
  //     result.push(tmp[i]);
  // }
	return result;
}
module.exports = craftItem;