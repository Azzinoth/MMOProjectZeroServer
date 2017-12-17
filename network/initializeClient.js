const Character = require('../gameData/person/Character');
const Request = require('./Request');
const visibleObjects = require('../gameData/visibleObjects');
const stackUtils = require('../gameData/inventory/stackUtils')
const viewDistance = 20;
const width = 48*3;
const height = 48*3;
const {
	SESSION_ID,
    HUMAN_DATA,
	MAP_OBJECT,
    ITEMS_LIST,
    CRAFT,
    PLAYER_DATA,
    INVENTORY_DATA,
    HOT_BAR_DATA,
    NPC_DATA,
    INVENTORY_CHANGE
} = require('../constants').messageTypes;

function initializeClient(data, characterId, inventoryId, hotBarId, armorInventoryId){
    clients = data.clients;
    inventories = data.inventories;
    characters = data.characters;
    itemsType = data.itemsType;
    cellsMap = data.getMap();
    recipeList = data.recipeList;
	

    clients[characterId].send(JSON.stringify(new Request({type:SESSION_ID, request:characterId})));
	characters[characterId] = new Character(characterId, inventoryId,armorInventoryId,hotBarId, null, true, 10, 10, 10*64, 10*64, 1, 3, 1, 10);
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

    clients[characterId].send(JSON.stringify(new Request({type:INVENTORY_DATA, request:data.inventories[inventoryId]})));
    clients[characterId].send(JSON.stringify(new Request({type:HOT_BAR_DATA, request:data.inventories[hotBarId]})));

    visibleObjects.findCharacters(characters, viewDistance, characterId);
    clients[characterId].send(JSON.stringify(new Request({type:ITEMS_LIST, request:itemsType})));
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
    let surAnimals = visibleObjects.surroundAnimals(characters[characterId].column, characters[characterId].row, characters[characterId].viewDistance, data.animals);
    if (surAnimals.length>0)
        clients[characterId].send(JSON.stringify(new Request({type:NPC_DATA, request:surAnimals})));

    let stacks = stackUtils.addStack(inventories[inventoryId], data.stacks, 1, 60);
    clients[characterId].send(JSON.stringify(new Request({type:INVENTORY_CHANGE, request:stacks})));
    stacks = stackUtils.addStack(inventories[inventoryId], data.stacks, 2, 60);
    clients[characterId].send(JSON.stringify(new Request({type:INVENTORY_CHANGE, request:stacks})));
}
module.exports = initializeClient;