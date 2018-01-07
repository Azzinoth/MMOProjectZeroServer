let accounts = {};
let characters = {};
let inventories = {};
let stacks = {};
// let mapStacks = {};
// let mapInventories = {};
let mapLoots = {};
let items = {};
let mapItemsCatalog = {};
//let mapItems = {};
let resources = {};
let buildingParts = {};
let cellsMap;
let recipeList={};
let identificators ={};
let animals ={};
let zones ={};
let firedAmmos =new Array(2000);

const width = 48*3;
const height = 48*3;
const MapItem = require('./mapItem/MapItem');
const Tree = require('./mapItem/resource/Tree');
const Rock = require('./mapItem/resource/Rock');
const WoodWall = require('./mapItem/buildingPart/wall/WoodWall');
const StoneWall = require('./mapItem/buildingPart/wall/StoneWall');
const Item = require('./item/Item');
const CraftRecipe = require('./craft/CraftRecipe');
const Character = require('./person/Character');
const Cell = require('./map/Cell');
const Stack = require('./inventory/Stack');
const Inventory = require('./inventory/Inventory');
const FiredAmmo = require('./item/unique/weapon/FiredAmmo');
const Rabbit = require('./npc/animals/Rabbit');
const BullSheep = require('./npc/animals/BullSheep');
const Location = require('./Location');
const Zone = require('./map/Zone');
const CommonItem = require('./item/common/CommonItem');
const Bow = require('./item/unique/weapon/range/Bow');
const Account = require('../Account');
function fillId(sqlUtils){
    sqlUtils.selectAll('identificators', callBackTable);
}
function fillData(sqlUtils){
    sqlUtils.selectAll('resources', callBackTable);
    sqlUtils.selectAll('buildingParts', callBackTable);
    sqlUtils.selectAll('accounts', callBackTable);
	sqlUtils.selectAll('items', callBackTable);
	sqlUtils.selectAll('mapItemsCatalog', callBackTable);
	sqlUtils.selectAll('mapCells', callBackTable);

    sqlUtils.selectAll('resources', callBackTable);
    sqlUtils.selectAll('buildingParts', callBackTable);

    sqlUtils.selectAll('inventories', callBackTable);
	sqlUtils.selectAll('stacks', callBackTable);
    sqlUtils.selectAll('commonItems', callBackTable);
    sqlUtils.selectAll('weaponsRange', callBackTable);

	sqlUtils.selectAll('craftRecipes', callBackTable);
	sqlUtils.selectAll('ingredients', callBackTable);

    sqlUtils.selectAll('characters', callBackTable);
	sqlUtils.selectAll('characterRecipes', callBackTable);

    sqlUtils.selectAll('zones', callBackTable);
    sqlUtils.selectAll('animals', callBackTable);

    for(let i =0; i<firedAmmos.length; i++){
        firedAmmos[i]=new FiredAmmo();
    }
}
function getId(dataName){
	let id = null;
	switch (dataName){
        case 'account':{
            identificators.accountId++;
            id = identificators.accountId;
        }
            break;
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
        case 'zone':
            identificators.zoneId++;
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
        case 'accounts':{
            for (let i =0; i<tableRows.length; i++){
                accounts[tableRows[i].id] = new Account(tableRows[i].id, tableRows[i].email, tableRows[i].password);
            }
        }
            break;
        case 'identificators':
            identificators.accountId = tableRows[0].accountId;
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
                items[tableRows[i].id] = new Item(tableRows[i].id, tableRows[i].typeName, tableRows[i].stackSize);
            }

		break;
		case 'mapItemsCatalog':
			for (let i =0; i<tableRows.length; i++){
				mapItemsCatalog[tableRows[i].id] = new MapItem(tableRows[i].id, null, tableRows[i].typeId);
			}
		break;
		case 'mapCells':{
			let tmpMapCells = new Array(width);
			for (let i=0;i<width;i++){
                tmpMapCells[i] = new Array(width);
                // tmpMapCells[i] = new Array();
            }
			for (let i =0; i<tableRows.length; i++){	
				tmpMapCells[tableRows[i].column][tableRows[i].row]=new Cell(tableRows[i].column, tableRows[i].row, tableRows[i].movable==1?true:false, tableRows[i].objectId, tableRows[i].mapItemId);
			}
			cellsMap = tmpMapCells
        }
		break;
        case 'resources':
            for (let i =0; i<tableRows.length; i++){
                switch(tableRows[i].id){
                    case 15:
                    case 16:
                    case 17:{
                        resources[tableRows[i].mapItemId] = new Tree(tableRows[i].id, tableRows[i].mapItemId, tableRows[i].typeId);
                    }
                    break;
                    case 8:
                    case 9:
                    case 10:{
                        resources[tableRows[i].mapItemId] = new Rock(tableRows[i].id, tableRows[i].mapItemId, tableRows[i].typeId);
                    }
                        break;
                }

            }
            break;
        case 'buildingParts':
            for (let i =0; i<tableRows.length; i++){
                switch(tableRows[i].id){
                    case 3:{
                        buildingParts[tableRows[i].mapItemId] = new WoodWall(tableRows[i].id, tableRows[i].mapItemId, tableRows[i].typeId, tableRows[i].characterId);
                        buildingParts[tableRows[i].mapItemId].durability = tableRows[i].durability;
                    }
                        break;
                    case 4:{
                        buildingParts[tableRows[i].mapItemId] = new StoneWall(tableRows[i].id, tableRows[i].mapItemId, tableRows[i].typeId, tableRows[i].characterId);
                        buildingParts[tableRows[i].mapItemId].durability = tableRows[i].durability;
                    }
                        break;
                }
            }
            break;
		case 'characters':
			for (let i =0; i<tableRows.length; i++){
				characters[tableRows[i].id] = new Character(tableRows[i].id, tableRows[i].accountId, tableRows[i].inventoryId,
                    tableRows[i].armorInventoryId, tableRows[i].hotBarId, tableRows[i].activeHotBarCell,
                    false, tableRows[i].column, tableRows[i].row,
                    tableRows[i].top, tableRows[i].left, tableRows[i].level, tableRows[i].health,
                    tableRows[i].strength, tableRows[i].viewDistance);
			}
		break;
        case 'animals':
            for (let i =0; i<tableRows.length; i++){
                switch (tableRows[i].type){
                    case 1:
                        animals[tableRows[i].id] = new Rabbit(tableRows[i].id, new Location(tableRows[i].column, tableRows[i].row, tableRows[i].top, tableRows[i].left), tableRows[i].zoneId);
                        break;
                    case 2:
                        animals[tableRows[i].id] = new BullSheep(tableRows[i].id, new Location(tableRows[i].column, tableRows[i].row, tableRows[i].top, tableRows[i].left), tableRows[i].zoneId);
                        break;
                }
            }
            break;
		case 'inventories':
			for (let i =0; i<tableRows.length; i++){
				inventories[tableRows[i].id] = new Inventory(tableRows[i].id, tableRows[i].size);
			}
		break;
		case 'characterRecipes':
			for (let i =0; i<tableRows.length; i++){
				characters[tableRows[i].characterId].craftRecipesId.push(tableRows[i].recipeId);
			}
		break;
		case 'stacks':
			for (let i =0; i<tableRows.length; i++){
				stacks[tableRows[i].id] = new Stack(tableRows[i].id, tableRows[i].inventoryId, tableRows[i].position);
                stacks[tableRows[i].id].size = tableRows[i].size;
                inventories[tableRows[i].inventoryId].stacks[tableRows[i].position] = tableRows[i].id;
			}
		break;
		case 'ingredients':
			for (let i =0; i<tableRows.length; i++){
                recipeList[tableRows[i].recipeId].ingredients.push(new CraftRecipe.Ingredient(tableRows[i].typeId, tableRows[i].amount));
			}
		break;
		case 'craftRecipes':
			for (let i =0; i<tableRows.length; i++){
				recipeList[tableRows[i].id] = new CraftRecipe.CraftRecipe(tableRows[i].id, tableRows[i].craftedTypeId, tableRows[i].name, new Array(), tableRows[i].outputAmount, tableRows[i].categoryName);
			}
		break;
        case 'zones':
            for (let i =0; i<tableRows.length; i++){
                zones[tableRows[i].id] = new Zone(tableRows[i].id, tableRows[i].fromColumn, tableRows[i].fromRow, tableRows[i].toColumn, tableRows[i].toRow, tableRows[i].type);
            }
            break;
        case 'commonItems':
            for (let i =0; i<tableRows.length; i++){
                stacks[tableRows[i].stackId].item = new CommonItem(tableRows[i].typeId, tableRows[i].name, tableRows[i].stackSize);
            }
            break;
        case 'weaponsRange':
            for (let i =0; i<tableRows.length; i++){
                stacks[tableRows[i].stackId].item = new Bow(tableRows[i].typeId, tableRows[i].itemId, tableRows[i].durability, tableRows[i].damage, tableRows[i].accuracy, tableRows[i].fireRate, tableRows[i].distance, tableRows[i].reloadTime, tableRows[i].magazineSize);
            }
            break;

	}
}
function createInventory(size){
    let inventoryId = getId('inventory');
    inventories[inventoryId] = new Inventory(inventoryId, size);
    for (let i=0; i<inventories[inventoryId].stacks.length; i++){
        let stackId = getId('stack');
        stacks[stackId] = new Stack(stackId, inventoryId, i);
        inventories[inventoryId].stacks[i] = stackId;
    }
    return inventoryId;
}
function createMapInventory(size){
  let inventoryId = getId('inventory');
  mapInventories[inventoryId] = new Inventory(inventoryId, size);
  for (let i=0; i<mapInventories[inventoryId].stacks.length; i++){
    let stackId = getId('stack');
    mapStacks[stackId] = new Stack(stackId, inventoryId, i);
    mapInventories[inventoryId].stacks[i] = stackId;
  }
  return inventoryId;
}

function createCharacter(accountId, column, row){
    let characterId = getId('character');
    let inventoryId = createInventory(24);
    let armorInventoryId = createInventory(2);
    let hotBarId = createInventory(3);
    characters[characterId] = new Character(characterId, accountId, inventoryId,armorInventoryId,hotBarId, null, true, column, row, column*64, row*64, 1, 10, 1, 20);
    for (let key in recipeList){
        characters[characterId].craftRecipesId.push(parseInt(key));
    }
    return characterId;
}
exports.accounts = accounts;
exports.characters = characters;
exports.inventories = inventories;
exports.items = items;
exports.mapItemsCatalog = mapItemsCatalog;
exports.resources = resources;
exports.buildingParts = buildingParts;
exports.recipeList=recipeList;
exports.stacks = stacks;
// exports.mapInventories = mapInventories;
// exports.mapStacks = mapStacks;
exports.mapLoots = mapLoots;
exports.identificators=identificators;
exports.firedAmmos = firedAmmos;
exports.zones = zones;
exports.animals = animals;
// exports.commonItems = commonItems;
exports.callBackTable = callBackTable;
exports.getMap = getMap;
exports.getId = getId;
exports.fillData = fillData;
exports.fillId = fillId;
exports.createInventory = createInventory;
exports.createCharacter = createCharacter;
// exports.createMapInventory = createMapInventory;
