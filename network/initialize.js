const Request = require('./Request');
const visibleObjects = require('../gameData/visibleObjects');
const stackUtils = require('../gameData/inventory/stackUtils');
const sender = require('./sender');
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

function initialize(data, accountId){

    let characterId = null;
    for (let key in data.characters){
        if (data.characters[key].accountId===accountId){
            characterId=key;
            break;
        }
    }
    if (characterId===null) return 1;
    sender.sendToClient(data.characters[characterId].accountId, new Request({type:SESSION_ID, request:characterId}));


    let request = new Request ({type:PLAYER_DATA, request:data.characters[characterId]});
    sender.sendToClient(data.characters[characterId].accountId, request);

    for (let key in data.characters) {
		if (key!=characterId){
            request = new Request ({type:HUMAN_DATA, request:data.characters[key].id});
            sender.sendToClient(data.characters[characterId].accountId, request)
		}
        
    }
    request = new Request({type:INVENTORY_DATA, request:data.inventories[data.characters[characterId].inventoryId]});
    sender.sendToClient(data.characters[characterId].accountId, request);

    request = new Request({type:HOT_BAR_DATA, request:data.inventories[data.characters[characterId].hotBarId]});
    sender.sendToClient(data.characters[characterId].accountId, request);

    request = new Request({type:ITEMS_LIST, request:data.items});
    sender.sendToClient(data.characters[characterId].accountId, request);

    request = new Request({type:CRAFT, request:data.recipeList});
    sender.sendToClient(data.characters[characterId].accountId, request);

    request = new Request ({type:HUMAN_DATA, request:characterId});
    sender.sendAllExcept(request, data.characters[characterId].accountId);
	for (let key in data.characters) {
		if (+key!==characterId){
            let founderCharacters = visibleObjects.findCharacters(data.characters, data.characters[key].viewDistance, key);
            let resultChatacter=null;
            for (let i=0; i<founderCharacters.length; i++){
                resultChatacter = new Array(founderCharacters[i].id, founderCharacters[i].column, founderCharacters[i].row, founderCharacters[i].left, founderCharacters[i].top, founderCharacters[i].direction);
                request = new Request({type:HUMAN_MOVE, request:resultChatacter});
                sender.sendToClient(data.characters[characterId].accountId, request)

                resultChatacter = new Array(data.characters[characterId].id, data.characters[characterId].column, data.characters[characterId].row, data.characters[characterId].left, data.characters[characterId].top, data.characters[characterId].direction);
                request = new Request({type:HUMAN_MOVE, request:resultChatacter});
                sender.sendToClient(data.characters[founderCharacters[i].id].accountId, request);
            }
		}
	}
	
	let nearbyObjects = visibleObjects.surroundObjects(data.characters[characterId].column, data.characters[characterId].row, data.characters[characterId].viewDistance, width, height, data.getMap());
    let result = [];
    for(let i=0; i<nearbyObjects.length; i++){
        result.push(new Array(nearbyObjects[i].column, nearbyObjects[i].row, nearbyObjects[i].objectId));
    }
    request = new Request({type:MAP_OBJECT, request:result});
    sender.sendToClient(data.characters[characterId].accountId, request)

    let surAnimals = visibleObjects.surroundAnimals(data.characters[characterId].column, data.characters[characterId].row, data.characters[characterId].viewDistance, data.animals);
    if (surAnimals.length>0){
        request = new Request({type:NPC_DATA, request:surAnimals});
        sender.sendToClient(data.characters[characterId].accountId, request);
    }

    stackUtils.addStack(data.inventories,data.characters[characterId], data.stacks, 1, 60);
    // request = new Request({type:INVENTORY_CHANGE, request:stacks});
    // sender.sendToClient(data.characters[characterId].accountId, request);
    stackUtils.addStack(data.inventories,data.characters[characterId], data.stacks, 2, 60);
    let allInventory = [];
    let mainInventory = data.inventories[data.characters[characterId].inventoryId];
    let hotBar = data.inventories[data.characters[characterId].hotBarId];
    let armorInventory = data.inventories[data.characters[characterId].armorInventoryId];
    for (let i = 0; i<mainInventory.stacks.length; i++){
        if (data.stacks[mainInventory.stacks[i]].item!==null){
            allInventory.push(data.stacks[mainInventory.stacks[i]])
        }
    }
    for (let i = 0; i<hotBar.stacks.length; i++){
        if (data.stacks[hotBar.stacks[i]].item!==null){
            allInventory.push(data.stacks[hotBar.stacks[i]])
        }
    }
    for (let i = 0; i<armorInventory.stacks.length; i++){
        if (data.stacks[armorInventory.stacks[i]].item!==null){
            allInventory.push(data.stacks[armorInventory.stacks[i]])
        }
    }
    if (allInventory.length===0) return;
    request = new Request({type:INVENTORY_CHANGE, request:allInventory});
    sender.sendToClient(data.characters[characterId].accountId, request);
}
module.exports = initialize;