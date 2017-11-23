let clients = {};
let characters = {};
let inventories = {};
//let stacks = {};
let items = {};
let mapItems = {};
let cellsMap;
let recipeList={};


const width = 48;
const height = 48;
const MapItem = require('./item/MapItem');
const Item = require('./item/Item');
const CraftRecipe = require('./craft/CraftRecipe');
const Character = require('./person/Character');
const Cell = require('./map/Cell');
const Stack = require('./inventory/Stack');

function fillData(sqlUtils){
	
	sqlUtils.selectAll('items', callBackTable);
	sqlUtils.selectAll('mapItems', callBackTable);
	sqlUtils.selectAll('mapCells', callBackTable);
    sqlUtils.selectAll('stacks', callBackTable);
	sqlUtils.selectAll('craftRecipes', callBackTable)
    .then(
        result=>
            sqlUtils.selectAll('ingredients', callBackTable)
	).then(
        result=>
            sqlUtils.selectAll('inventories', callBackTable)
	).then(
        result=>
			sqlUtils.selectAll('characterRecipes', callBackTable)
	).then(
        result=>
			sqlUtils.selectAll('characters', callBackTable)
	);






}
function getMap(){
	return cellsMap;
}
function getCraftList(){
	return craftList;
}
function callBackTable(tableRows, tableName){
	switch(tableName){
		case 'items':
			for (let i =0; i<tableRows.length; i++){
				items[tableRows[i].id] = new Item({id:tableRows[i].id, name:tableRows[i].name, type:tableRows[i].type, stackSize:tableRows[i].stackSize});
			}
		break;
		case 'mapItems':
			for (let i =0; i<tableRows.length; i++){
				mapItems[tableRows[i].id] = new MapItem({id:tableRows[i].id, name:tableRows[i].name, size:tableRows[i].size});
			}
		break;
		case 'mapCells':
			let tmpMapCells = new Array(2304).fill([]);
			for (let i =0; i<tableRows.length; i++){	
				tmpMapCells[tableRows[i].column][tableRows[i].row] = new Cell({movable : tableRows[i].isMovable==1?true:false, column : tableRows[i].column, row : tableRows[i].row});
			}
			cellsMap = tmpMapCells
		break;
		case 'characters':
			for (let i =0; i<tableRows.length; i++){
				characters[tableRows[i].id] = new Character({id:tableRows[i].id, idInventory:tableRows[i].idInventory, isPlayer:tableRows[i].isPlayer==1?true:false, column:tableRows[i].column, row:tableRows[i].row, health:tableRows[i].health, strength:tableRows[i].strength});
			}
		break;
		case 'inventories':
			for (let i =0; i<tableRows.length; i++){
				inventories[tableRows[i].id] = new Inventory({id:tableRows[i].id, size:tableRows[i].size});
			}
		break;
		case 'characterRecipes':
			for (let i =0; i<tableRows.length; i++){
				characters[tableRows[i].characterId].craftRecipesId.push(tableRows[i].recipeId);
			}
		break;
		case 'stacks':
			for (let i =0; i<tableRows.length; i++){
				stacks[tableRows[i].id] = new Stack({id:tableRows[i].id, itemId:tableRows[i].itemId, size:tableRows[i].size});
			}
		break;
		case 'ingredients':
			for (let i =0; i<tableRows.length; i++){
                recipeList[tableRows[i].recipeId].ingredients.push(new CraftRecipe.Ingredient(2, 3));
			}
		break;
		case 'craftRecipes':
			for (let i =0; i<tableRows.length; i++){
				recipeList[tableRows[i].id] = new CraftRecipe.CraftRecipe(tableRows[i].id, tableRows[i].craftItemId, tableRows[i].name, new Array(), tableRows[i].outputAmount, tableRows[i].categoryName);
			}
		break;
	}
}
exports.fillData = fillData;
exports.clients = clients;
exports.characters = characters;
exports.inventories = inventories;
//exports.stacks = stacks;
exports.items = items;
exports.mapItems = mapItems;
exports.getCraftList = getCraftList;
exports.getMap = getMap;
//exports.callBack = callBack;