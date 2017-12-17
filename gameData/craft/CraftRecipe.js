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

function CraftRecipe(id, craftedTypeId, name, ingredients, outputAmount, categoryName) {
    this.id = id;
    this.craftedTypeId = craftedTypeId;
    this.name = name;
    this.ingredients = ingredients;
    this.outputAmount = outputAmount;
	this.categoryName = categoryName;

}

CraftRecipe.prototype = CraftRecipeProto;
// ******* CRAFTRECIPE END *******

exports.Ingredient = Ingredient;
exports.CraftRecipe = CraftRecipe;