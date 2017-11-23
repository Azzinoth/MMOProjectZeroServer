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
    ITEMS_LIST
} = require('../constants').messageTypes;

function initializeClient(clients, idCharacter, inventories, characters, craftList, idInventory, items, cellsMap){
	
	
	clients[idCharacter].send(JSON.stringify(new Request({type:SESSION_ID, request:idCharacter})));
	
	inventories[idInventory] = new Inventory({id:idInventory, size:24});
	characters[idCharacter] = new Character({id:characterId, idInventory:idInventory, isPlayer:true, column:10, row:10, health:3, strength:1});
	characters[idCharacter].craftList = craftList;
    clients[idCharacter].send(JSON.stringify(new Request({type:ITEMS_LIST, request:items})));
    let myInventoryId = characters[idCharacter].idInventory;
	let request;
	for (let key in clients) {
		if (+key!==idCharacter){
			request = new Request ({type:HUMAN_DATA, request:characters[idCharacter]})
			clients[key].send(JSON.stringify(request));	
		}
	}
	
	let nearbyObjects = surroundObjects(characters[idCharacter].column, characters[idCharacter].row, viewDistance, width, height, cellsMap);
	clients[idCharacter].send(JSON.stringify(new Request({type:MAP_OBJECT, request:nearbyObjects})));
	
	for (let key in characters) {
		request = new Request ({type:HUMAN_DATA, request:characters[key]})
		clients[idCharacter].send(JSON.stringify(request));		
	}
}
module.exports = initializeClient;