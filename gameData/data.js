let clients = {};
let characters = {};
let inventories = {};
let stacks = {};
let items = {};
let mapItems = {};
let cellsMap;
let recipeList={};
let identificators ={};
let animals ={};
let zones ={};
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
const Rabbit = require('./npc/animals/Rabbit');
const BullSheep = require('./npc/animals/BullSheep');
const Location = require('./Location');
const Zone = require('./map/Zone');
function fillId(sqlUtils){
    sqlUtils.selectAll('identificators', callBackTable);
}
function fillData(sqlUtils){
	sqlUtils.selectAll('items', callBackTable);
	sqlUtils.selectAll('mapItems', callBackTable);
	sqlUtils.selectAll('mapCells', callBackTable);
	sqlUtils.selectAll('stacks', callBackTable);
	sqlUtils.selectAll('craftRecipes', callBackTable);
	sqlUtils.selectAll('ingredients', callBackTable);
	sqlUtils.selectAll('inventories', callBackTable);
	sqlUtils.selectAll('characterRecipes', callBackTable);
	sqlUtils.selectAll('characters', callBackTable);
    sqlUtils.selectAll('animals', callBackTable);
    sqlUtils.selectAll('zones', callBackTable);

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
        case 'animal':{
            identificators.animalId++;
            id = identificators.animalId;
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
        case 'weapon':
            identificators.weaponId++;
            id = identificators.weaponId;
            break;
        case 'zone':
            identificators.zoneId++;
            id = identificators.zoneId;
            break;
	}
	return id;
}
function showLastId(dataName){
    let id = null;
    switch (dataName){
        case 'character':{
            id =  identificators.characterId
        }
            break;
        case 'animal':{
            id =  identificators.animalId
        }
            break;
        case 'inventory':{
            id = identificators.inventoryId;
        }
            break;
        case 'stack':
            id = identificators.stackId;
            break;
        case 'item':
            id = identificators.itemId;
            break;
        case 'mapItem':
            id = identificators.mapItemId;
            break;
        case 'recipe':
            id = identificators.recipeId;
            break;
        case 'weapon':
            id = identificators.weaponId;
            break;
        case 'zone':
            id = identificators.zoneId;
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
            identificators.animalId = tableRows[0].animalId;
            identificators.inventoryId = tableRows[0].inventoryId;
            identificators.stackId = tableRows[0].stackId;
            identificators.itemId = tableRows[0].itemId;
            identificators.mapItemId = tableRows[0].mapItemId;
            identificators.recipeId = tableRows[0].recipeId;
            identificators.zoneId = tableRows[0].zoneId;
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
				characters[tableRows[i].id] = new Character(tableRows[i].id, tableRows[i].idInventory,
                    tableRows[i].isPlayer==1?true:false, tableRows[i].column, tableRows[i].row,
                    tableRows[i].top, tableRows[i].left, tableRows[i].level, tableRows[i].health,
                    tableRows[i].strength);
                characters[tableRows[i].id].armId = tableRows[i].armId;
                characters[tableRows[i].id].bodyId = tableRows[i].bodyId;
                characters[tableRows[i].id].headId = tableRows[i].headId;
			}
		break;
        case 'animals':
            for (let i =0; i<tableRows.length; i++){
                switch (tableRows[i].name){
                    case 'rabbit':
                        animals[tableRows[i].id] = new Rabbit(tableRows[i].id, new Location(tableRows[i].column, tableRows[i].row, tableRows[i].top, tableRows[i].left));
                        break;
                    case 'bullsheep':
                        animals[tableRows[i].id] = new BullSheep(tableRows[i].id, new Location(tableRows[i].column, tableRows[i].row, tableRows[i].top, tableRows[i].left));
                        break;
                }
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
        case 'zones':
            for (let i =0; i<tableRows.length; i++){
                zones[tableRows[i].id] = new Zone(tableRows[i].id, tableRows[i].fromColumn, tableRows[i].fromRow, tableRows[i].toColumn, tableRows[i].toRow, tableRows[i].type);
            }
            break;
	}
}
function createInventory(size){
    let inventoryId = getId('inventory');
    inventories[inventoryId] = new Inventory(inventoryId, size);
    for (let i=0; i<inventories[inventoryId].stacks.length; i++){
        let stackId = getId('stack');
        stacks[stackId] = new Stack(stackId, null, null, inventoryId);
        inventories[inventoryId].stacks[i] = stackId;
    }
    return inventoryId;
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
exports.zones = zones;
exports.animals = animals;
exports.callBackTable = callBackTable;
exports.showLastId=showLastId;
exports.getMap = getMap;
exports.getId = getId;
exports.fillData = fillData;
exports.fillId = fillId;
exports.createInventory = createInventory;
