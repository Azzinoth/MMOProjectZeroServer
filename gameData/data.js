let clients = {};
let characters = {};
let inventories = {};
let stacks = {};
let items = {};
let mapItems = {};
let cellsMap;
let recipeList={};
let identificators ={};
let firedAmmos =new Array(2000);

const width = 48*3;
const height = 48*3;
const MapItem = require('./item/MapItem');
const Item = require('./item/Item');
const CraftRecipe = require('./craft/CraftRecipe');
const Character = require('./person/Character');
const Cell = require('./map/Cell');
const Stack = require('./inventory/Stack');
const Inventory = require('./inventory/Inventory');
const FiredAmmo = require('./FiredAmmo');

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
    for(let i =0; i<firedAmmos.length; i++){
        firedAmmos[i]=new FiredAmmo();
    }
}
function getId(dataName){
	let id = null;
	switch (dataName){
		case 'character':{
            identificators.characterId++;
            id = identificators.characterId;
        }
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
// function getFiredAmmos(){
//     return firedAmmos;
// }
// function setFiredAmmos(characterId, speedPerSec, initialX, initialY, finalX, finalY){
//     for (let i = 0; i<firedAmmos.length; i++){
//         if (!firedAmmos.active){
//             firedAmmos[i].characterId = characterId;
//             firedAmmos[i].speedPerSec = speedPerSec;
//             firedAmmos[i].initialX = initialX;
//             firedAmmos[i].initialY = initialY;
//             firedAmmos[i].finalX = finalX;
//             firedAmmos[i].finalY = finalY;
//             firedAmmos[i].distToFinal = Math.sqrt(Math.pow(firedAmmos[i].initialX - firedAmmos[i].finalX, 2) + Math.pow(firedAmmos[i].initialY - firedAmmos[i].finalY, 2));
//             firedAmmos[i].timeToFinal = firedAmmos[i].distToFinal / firedAmmos[i].speedPerSec * 1000;
//             let time = new Date().getTime();
//             firedAmmos[i].currentTick = time;
//             firedAmmos[i].lastTick = time;
//             firedAmmos[i].timePassed = 0;
//             firedAmmos[i].active = true;
//             indexFiredAmmo = i;
//             break;
//         }
//         if (i===data.firedAmmos.length-1){
//             let ammo = new FiredAmmo();
//             ammo.characterId = personId;
//             ammo.speedPerSec = 750;
//             ammo.initialX = characters[personId].left;
//             ammo.initialY = characters[personId].top;
//             ammo.finalX = json.request[0];
//             ammo.finalY = json.request[1];
//             ammo.distToFinal = Math.sqrt(Math.pow(ammo.initialX - ammo.finalX, 2) + Math.pow(ammo.initialY - ammo.finalY, 2));
//             ammo.timeToFinal = ammo.distToFinal / ammo.speedPerSec * 1000;
//             ammo.active = true;
//             indexFiredAmmo = data.firedAmmos.length;
//             data.firedAmmos.push(ammo);
//             break;
//         }
//     }
// }
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
				items[tableRows[i].id] = new Item({id:tableRows[i].id, type:tableRows[i].type, type:tableRows[i].type, stackSize:tableRows[i].stackSize});
			}
		break;
		case 'mapItems':
			for (let i =0; i<tableRows.length; i++){
				mapItems[tableRows[i].id] = new MapItem({id:tableRows[i].id, type:tableRows[i].type, size:tableRows[i].size, objectId:tableRows[i].objectId});
			}
		break;
		case 'mapCells':{
			let tmpMapCells = new Array(width);
			for (let i=0;i<width;i++){
                tmpMapCells[i] = new Array(width);
                // tmpMapCells[i] = new Array();
            }
			for (let i =0; i<tableRows.length; i++){	
				tmpMapCells[tableRows[i].column][tableRows[i].row]=new Cell({movable : tableRows[i].movable==1?true:false, column : tableRows[i].column, row : tableRows[i].row, objectId:tableRows[i].objectId});
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
exports.firedAmmos = firedAmmos;
// exports.getFiredAmmos=getFiredAmmos;
// exports.setFiredAmmos=setFiredAmmos;
exports.getMap = getMap;
exports.getId = getId;
exports.fillData = fillData;
