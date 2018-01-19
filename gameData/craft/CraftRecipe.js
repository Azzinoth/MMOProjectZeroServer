// ******* INGREDIENT *******
var IngredientProto = {
    typeId : -1,
    amount : -1,

}

function Ingredient(typeId, amount) {
    this.typeId = typeId;
    this.amount = amount;

}

Ingredient.prototype = IngredientProto;
// ******* INGREDIENT END *******

// ******* CRAFTRECIPE *******

var CraftRecipeProto = {
    id : -1,
    craftedTypeId: -1,
    name : "",
    ingredients : new Array(),
    outputAmount : 0,
	categoryName : null

}

function CraftRecipe(id, craftedTypeId, name, ingredients, outputAmount, categoryName, isVisible, instrumentId) {
    this.id = id;
    this.craftedTypeId = craftedTypeId;
    this.name = name;
    this.ingredients = ingredients;
    this.outputAmount = outputAmount;
	  this.categoryName = categoryName;
	  this.isVisible = isVisible;
	  this.instrumentId = instrumentId;
}

CraftRecipe.prototype = CraftRecipeProto;
// ******* CRAFTRECIPE END *******

CraftRecipe.prototype.createItem = function (inventory, character, stacks, items) {
    let result = [];
    let isEnoughtItem = false;
    let resourceForCraft = [];
/////////Check availability items in inventory by recipe

    for (let i = 0; i<recipe.ingredients.length; i++) {
      let findItems = stackUtils.findItems(recipe.ingredients[i].typeId, inventories, character, stacks);

      let amount = recipe.ingredients[i].amount;
      isEnoughtItem= false;
      if (findItems[0]<amount)break;
      resourceForCraft.push(findItems[1]);
      isEnoughtItem= true;
    }
    if (!isEnoughtItem)  return 1;
/////////Check available space in inventory
    let freeSpace = stackUtils.checkFreeSpace(items[recipe.craftedTypeId], inventories, character, stacks);

    if (freeSpace<recipe.outputAmount) return 2;

/////////////Get items from inventory and stacks by recipe
    for (let i = 0; i<recipe.ingredients.length; i++){
      let remove = stackUtils.removeItems(recipe.ingredients[i].amount, resourceForCraft[i]);
      for (let j = 0; j<remove.length; j++){
        result.push(remove[j]);
      }

    }
    let tmp = stackUtils.addStack(inventories, character, stacks, recipe.craftedTypeId, recipe.outputAmount, );
    for (let i = 0; i<tmp.length; i++){
      result.push(tmp[i]);
    }
    return result;
}

exports.Ingredient = Ingredient;
exports.CraftRecipe = CraftRecipe;