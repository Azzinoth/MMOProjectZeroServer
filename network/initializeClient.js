const Inventory = require('../gameData/inventory/Inventory');
const Character = require('../gameData/person/Character');
const Request = require('./Request');
const visibleObjects = require('../gameData/visibleObjects');
const viewDistance = 20;
const width = 48*3;
const height = 48*3;
const {
	SESSION_ID,
    HUMAN_DATA,
	MAP_OBJECT,
    ITEMS_LIST,
    CRAFT,
    PLAYER_DATA
} = require('../constants').messageTypes;

function initializeClient(data, characterId, inventoryId){
    clients = data.clients;
    inventories = data.inventories;
    characters = data.characters;
    items = data.items;
    cellsMap = data.getMap();
    recipeList = data.recipeList;
	

    clients[characterId].send(JSON.stringify(new Request({type:SESSION_ID, request:characterId})));
	characters[characterId] = new Character(characterId, inventoryId, true, 10, 10, 10*64, 10*64, 1, 3, 1);
	characters[characterId].craftRecipesId.push(1);
    characters[characterId].craftRecipesId.push(2);
    characters[characterId].craftRecipesId.push(3);
    characters[characterId].craftRecipesId.push(4);
    let request;
    for (let key in characters) {
		if (key==characterId){
			request = new Request ({type:PLAYER_DATA, request:characters[characterId]});
			clients[characterId].send(JSON.stringify(request));
		}else{
			request = new Request ({type:HUMAN_DATA, request:characters[key].id});
			clients[characterId].send(JSON.stringify(request));
		}
        
    }
    visibleObjects.findCharacters(characters, viewDistance, characterId);
    clients[characterId].send(JSON.stringify(new Request({type:ITEMS_LIST, request:items})));
    clients[characterId].send(JSON.stringify(new Request({type:CRAFT, request:recipeList})));

   // let myInventoryId = characters[characterId].inventoryId;

	for (let key in clients) {
		if (+key!==characterId){
			request = new Request ({type:HUMAN_DATA, request:characterId});
			clients[key].send(JSON.stringify(request));
            visibleObjects.findCharacters(characters, viewDistance, key);
		}
	}
	
	let nearbyObjects = visibleObjects.surroundObjects(characters[characterId].column, characters[characterId].row, viewDistance, width, height, cellsMap);
	clients[characterId].send(JSON.stringify(new Request({type:MAP_OBJECT, request:nearbyObjects})));
	

}
module.exports = initializeClient;