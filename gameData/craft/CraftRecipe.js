// ******* INGREDIENT *******
var IngredientProto = {
    itemId : -1,
    amount : -1,
	
}

function Ingredient(itemId, amount) {
    this.itemId = itemId;
    this.amount = amount;
	this.recipeId = recipeId;
}

Ingredient.prototype = IngredientProto;
// ******* INGREDIENT END *******

// ******* CRAFTRECIPE *******

var CraftRecipeProto = {
    id : -1,
    craftedItemId: -1,
    name : "",
    ingredients : [],
    outputAmount : 0,
	categoryName : null

}

function CraftRecipe(id, craftedItemId, name, ingredients, outputAmount, categoryName) {
    this.id = id;
    this.craftedItemId = craftedItemId;
    this.name = name;
    this.ingredients = ingredients;
    this.outputAmount = outputAmount;
	this.categoryName = null;

}

CraftRecipe.prototype = CraftRecipeProto;
// ******* CRAFTRECIPE END *******

exports.Ingredient = Ingredient;
exports.CraftRecipe = CraftRecipe;