const Inventory = require('../gameData/inventory/Inventory');
const Character = require('../gameData/person/Character');
const Request = require('./Request');
const surroundObjects = require('../gameData/person/utils/surroundObjects');
const viewDistance = 20;
const width = 48;
const height = 48;
const {
	SESSION_ID,
    HUMAN_DATA,
	MAP_OBJECT,
    ITEMS_LIST,
    CRAFT
} = require('../constants').messageTypes;

function initializeClient(data, characterId, inventoryId){
    clients = data.clients;
    inventories = data.inventories;
    characters = data.characters;
    items = data.items;
    cellsMap = data.getMap();
    recipeList = data.recipeList;
	

    clients[characterId].send(JSON.stringify(new Request({type:SESSION_ID, request:characterId})));
	inventories[inventoryId] = new Inventory({id:inventoryId, size:24});
	characters[characterId] = new Character({id:characterId, inventoryId:inventoryId, isPlayer:true, column:10, row:10, health:3, strength:1});
	characters[characterId].craftRecipesId.push(1);
    characters[characterId].craftRecipesId.push(2);
    let request;
    for (let key in characters) {
        request = new Request ({type:HUMAN_DATA, request:characters[key]})
        clients[characterId].send(JSON.stringify(request));
    }
    clients[characterId].send(JSON.stringify(new Request({type:ITEMS_LIST, request:items})));
    clients[characterId].send(JSON.stringify(new Request({type:CRAFT, request:recipeList})));

   // let myInventoryId = characters[characterId].inventoryId;

	for (let key in clients) {
		if (+key!==characterId){
			request = new Request ({type:HUMAN_DATA, request:characters[characterId]})
			clients[key].send(JSON.stringify(request));	
		}
	}
	
	let nearbyObjects = surroundObjects(characters[characterId].column, characters[characterId].row, viewDistance, width, height, cellsMap);
	clients[characterId].send(JSON.stringify(new Request({type:MAP_OBJECT, request:nearbyObjects})));
	

}
module.exports = initializeClient;