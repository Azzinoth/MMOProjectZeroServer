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
    craftRecipeId : -1,
    name : "",
    ingredients : null
}

function CraftRecipe(id, name, ingredients) {
    this.craftRecipeId = id;
    this.name = name;
    this.ingredients = ingredients;
}

CraftRecipe.prototype = CraftRecipeProto;
// ******* CRAFTRECIPE END *******

// ******* CATEGORY *******
var CategoryProto = {
    categoryId : -1,
    name : "",
    craftRecipes : null
}

function Category(id, name, craftRecipes) {
    this.categoryId = id;
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