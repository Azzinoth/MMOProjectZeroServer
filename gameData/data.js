let clients = {};
let characters = {};
let inventories = {};
//let stacks = {};
let items = {};
let mapItems = {};
let cellsMap;
let craftList;


const width = 48;
const height = 48;
const MapItem = require('./item/MapItem');
const Item = require('./item/Item');
const CraftRecipe = require('./craft/CraftRecipe');


function fillData(){
	
	mapItems[1] = new MapItem({id:1, name:'rock', size:5});
	mapItems[2] = new MapItem({id:2, name:'wood', size:5});
	items[1] = new Item({id:1, name:'stone', type:'resource', stackSize:20});
	items[2] = new Item({id:2, name:'wood', type:'resource', stackSize:20});
	items[3] = new Item({id:3, name:'woodWall', type:'buildingPart', stackSize:20});
	items[4] = new Item({id:4, name:'stoneWall', type:'buildingPart', stackSize:20});

	let arrayIngridients = new Array(new CraftRecipe.Ingredient(2, 6));
	let craftRecipe1 = new CraftRecipe.CraftRecipe(1, 3, "Wood wall", arrayIngridients, 1);
	let arrayIngridients2 = new Array(new CraftRecipe.Ingredient(1, 15));
	let craftRecipe2 = new CraftRecipe.CraftRecipe(2, 4, "Stone wall", arrayIngridients2, 1);
	let categories = new CraftRecipe.Category(1, "Building", new Array(craftRecipe1, craftRecipe2));
	craftList = new CraftRecipe.CraftList(new Array(categories));	
	const createLocation = require('./map/createLocation');
	cellsMap = createLocation(height, width);	
}
function getMap(){
	return cellsMap;
}
function getCraftList(){
	return craftList;
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