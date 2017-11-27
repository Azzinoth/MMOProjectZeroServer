let clients = {};
let characters = {};
let inventories = {};
let stacks = {};
let items = {};
let mapItems = {};
let cellsMap;
let recipeList={};
let identificators ={};


const width = 48;
const height = 48;
const MapItem = require('./item/MapItem');
const Item = require('./item/Item');
const CraftRecipe = require('./craft/CraftRecipe');
const Character = require('./person/Character');
const Cell = require('./map/Cell');
const Stack = require('./inventory/Stack');
const Inventory = require('./inventory/Inventory');


function fillData(sqlUtils,toData){
    sqlUtils.initDB();
    sqlUtils.selectAll('identificators', callBackTable)
	.then(
		 result=>
	sqlUtils.selectAll('items', callBackTable)
	).then(
		result=>
	sqlUtils.selectAll('mapItems', callBackTable)
	).then(
		result=>
	sqlUtils.selectAll('mapCells', callBackTable)
	).then(
		result=>
    sqlUtils.selectAll('stacks', callBackTable)
	).then(
		result=>
		sqlUtils.selectAll('craftRecipes', callBackTable)
	).then(
        result=>
            sqlUtils.selectAll('ingredients', callBackTable)
	).then(
        result=>
            sqlUtils.selectAll('inventories', callBackTable)
	).then(
        result=>
			sqlUtils.selectAll('characterRecipes', callBackTable)
	).then(
        result=>{
			sqlUtils.selectAll('characters', callBackTable),
            sqlUtils.closeDB()
        }
	);

}
function getId(dataName){
	let id = null;
	switch (dataName){
		case 'character':
            identificators.characterId++;
            id = identificators.characterId;
			break;
        case 'inventory':{
            identificators.inventoryId++;
            id = identificators.inventoryId;
        }
            break;
        case 'stack':
            identificators.stackId++;
            id = identificators.stackId;
            break;
        case 'item':
            identificators.itemId++;
            id = identificators.itemId;
            break;
        case 'mapItem':
            identificators.mapItemId++;
            id = identificators.mapItemId;
            break;
        case 'recipe':
            identificators.recipeId++;
            id = identificators.recipeId;
            break;
	}
	return id;
}
function getMap(){
	return cellsMap;
}
function callBackTable(tableRows, tableName){
	switch(tableName){
        case 'identificators':
            identificators.characterId = tableRows[0].characterId;
            identificators.inventoryId = tableRows[0].inventoryId;
            identificators.stackId = tableRows[0].stackId;
            identificators.itemId = tableRows[0].itemId;
            identificators.mapItemId = tableRows[0].mapItemId;
            identificators.recipeId = tableRows[0].recipeId;
		break;
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
		case 'mapCells':{
			let tmpMapCells = new Array(48);
			for (let i=0;i<48;i++){
                tmpMapCells[i] = new Array(48);
            }
			for (let i =0; i<tableRows.length; i++){	
				tmpMapCells[tableRows[i].column][tableRows[i].row] = new Cell({movable : tableRows[i].movable==1?true:false, column : tableRows[i].column, row : tableRows[i].row, objectId:tableRows[i].objectId});
			}
			cellsMap = tmpMapCells
        }
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
				stacks[tableRows[i].id] = new Stack({id:tableRows[i].id, itemId:tableRows[i].itemId, size:tableRows[i].size, inventoryId:tableRows[i].inventoryId});
			}
		break;
		case 'ingredients':
			for (let i =0; i<tableRows.length; i++){
                recipeList[tableRows[i].recipeId].ingredients.push(new CraftRecipe.Ingredient(tableRows[i].itemId, tableRows[i].amount));
			}
		break;
		case 'craftRecipes':
			for (let i =0; i<tableRows.length; i++){
				recipeList[tableRows[i].id] = new CraftRecipe.CraftRecipe(tableRows[i].id, tableRows[i].craftedItemId, tableRows[i].name, new Array(), tableRows[i].outputAmount, tableRows[i].categoryName);
			}
		break;
	}
}
exports.clients = clients;
exports.characters = characters;
exports.inventories = inventories;
exports.items = items;
exports.mapItems = mapItems;
exports.recipeList=recipeList;
exports.stacks = stacks;
exports.identificators=identificators;
exports.getMap = getMap;
exports.getId = getId;
exports.fillData = fillData;
