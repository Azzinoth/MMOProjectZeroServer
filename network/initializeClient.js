const Character = require('../gameData/person/Character');
const Request = require('./Request');
const visibleObjects = require('../gameData/visibleObjects');
const stackUtils = require('../gameData/inventory/stackUtils')
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
    INVENTORY_CHANGE,
    HUMAN_MOVE
} = require('../constants').messageTypes;

function initializeClient(data, characterId, inventoryId, hotBarId, armorInventoryId){
    clients = data.clients;
    inventories = data.inventories;
    characters = data.characters;
    items = data.items;
    cellsMap = data.getMap();
    recipeList = data.recipeList;
	

    clients[characterId].send(JSON.stringify(new Request({type:SESSION_ID, request:characterId})));
	characters[characterId] = new Character(characterId, inventoryId,armorInventoryId,hotBarId, null, true, 10, 10, 10*64, 10*64, 1, 3, 1, 20);
	for (let key in recipeList){
        characters[characterId].craftRecipesId.push(+key);
    }

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

    // let founderCharacters = visibleObjects.findCharacters(characters, characters[characterId].viewDistance, characterId);
    // let resultChatacter=null;
    // for (let i=0; i<founderCharacters.length; i++){
    //     resultChatacter = new Array(founderCharacters[i].id, founderCharacters[i].column, founderCharacters[i].row, founderCharacters[i].left, founderCharacters[i].top);
    //     clients[characterId].send(JSON.stringify(new Request({type:HUMAN_MOVE, request:resultChatacter})));
    //     resultChatacter = new Array(characters[characterId].id, characters[characterId].column, characters[characterId].row, characters[characterId].left, characters[characterId].top);
    //     clients[characterId].send(JSON.stringify(new Request({type:HUMAN_MOVE, request:resultChatacter})));
    // }
    clients[characterId].send(JSON.stringify(new Request({type:ITEMS_LIST, request:items})));
    clients[characterId].send(JSON.stringify(new Request({type:CRAFT, request:recipeList})));

	for (let key in clients) {
		if (+key!==characterId){
			request = new Request ({type:HUMAN_DATA, request:characterId});
			clients[key].send(JSON.stringify(request));
            let founderCharacters2 = visibleObjects.findCharacters(characters, characters[key].viewDistance, key);
            let resultChatacter2=null;
            for (let i=0; i<founderCharacters2.length; i++){
                resultChatacter2 = new Array(founderCharacters2[i].id, founderCharacters2[i].column, founderCharacters2[i].row, founderCharacters2[i].left, founderCharacters2[i].top, founderCharacters2[i].direction);
                clients[characterId].send(JSON.stringify(new Request({type:HUMAN_MOVE, request:resultChatacter2})));
                resultChatacter2 = new Array(characters[characterId].id, characters[characterId].column, characters[characterId].row, characters[characterId].left, characters[characterId].top, characters[characterId].direction);
                clients[founderCharacters2[i].id].send(JSON.stringify(new Request({type:HUMAN_MOVE, request:resultChatacter2})));
            }
		}
	}
	
	let nearbyObjects = visibleObjects.surroundObjects(characters[characterId].column, characters[characterId].row, characters[characterId].viewDistance, width, height, cellsMap);
    let result = [];
    for(let i=0; i<nearbyObjects.length; i++){
        result.push(new Array(nearbyObjects[i].column, nearbyObjects[i].row, nearbyObjects[i].objectId));
    }
	clients[characterId].send(JSON.stringify(new Request({type:MAP_OBJECT, request:result})));
    let surAnimals = visibleObjects.surroundAnimals(characters[characterId].column, characters[characterId].row, characters[characterId].viewDistance, data.animals);
    if (surAnimals.length>0){
        clients[characterId].send(JSON.stringify(new Request({type:NPC_DATA, request:surAnimals})));
    }

    //clients[characterId].send(JSON.stringify(new Request({type:NPC_DATA, request:surAnimals})));
    let stacks = stackUtils.addStack(inventories,characters[characterId], data.stacks, 1, 60);
    clients[characterId].send(JSON.stringify(new Request({type:INVENTORY_CHANGE, request:stacks})));
    stacks = stackUtils.addStack(inventories,characters[characterId], data.stacks, 2, 60);
    clients[characterId].send(JSON.stringify(new Request({type:INVENTORY_CHANGE, request:stacks})));
}
module.exports = initializeClient;