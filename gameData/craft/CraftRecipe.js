// ******* INGREDIENT *******
var IngredientProto = {
    itemId : -1,
    amount : -1
}

function Ingredient(itemId, amount) {
    this.itemId = itemId;
    this.amount = amount;
}

Ingredient.prototype = IngredientProto;
// ******* INGREDIENT END *******

// ******* CRAFTRECIPE *******

var CraftRecipeProto = {
    id : -1,
    craftedItemId: -1,
    name : "",
    ingredients : null,
    outputAmount : 0,
}

function CraftRecipe(id, craftedItemId, name, ingredients, outputAmount) {
    this.id = id;
    this.craftedItemId = craftedItemId;
    this.name = name;
    this.ingredients = ingredients;
    this.outputAmount = outputAmount;
}

CraftRecipe.prototype = CraftRecipeProto;
// ******* CRAFTRECIPE END *******

// ******* CATEGORY *******
var CategoryProto = {
    id : -1,
    name : "",
    craftRecipes : null
}

function Category(id, name, craftRecipes) {
    this.id = id;
    this.name = name;
    this.craftRecipes = craftRecipes;
}

Category.prototype = CategoryProto;
// ******* CATEGORY END *******

// ******* CRAFT LIST *******
var CraftListProto = {
    categories : null
}

function CraftList(categories) {
    this.categories = categories;
}

CraftList.prototype = CraftListProto;
// ******* CRAFT LIST END *******
exports.Ingredient = Ingredient;
exports.CraftRecipe = CraftRecipe;
exports.Category = Category;
exports.CraftList = CraftList;