const Request = require('./Request');
const visibleObjects = require('../gameData/visibleObjects');
const stackUtils = require('../gameData/inventory/stackUtils');
const sender = require('./sender');
const MSG_TYPES = require('../constants/messageTypes');

function initialize(data, accountId) {

  let characterId = null;
  for (let key in data.characters) {
    if (data.characters[key].accountId === accountId) {
      characterId = key;
      break;
    }
  }
  if (characterId === null) return 1;
  sender.sendToClient(data.characters[characterId].accountId, new Request({type: MSG_TYPES.SESSION_ID, request: characterId}));


  let request = new Request({type: MSG_TYPES.PLAYER_DATA, request: data.characters[characterId]});
  sender.sendToClient(data.characters[characterId].accountId, request);

  for (let key in data.characters) {
    if (key != characterId) {
      request = new Request({type: MSG_TYPES.HUMAN_DATA, request: data.characters[key].id});
      sender.sendToClient(data.characters[characterId].accountId, request)
    }

  }
  request = new Request({type: MSG_TYPES.INVENTORY_DATA, request: data.inventories[data.characters[characterId].inventoryId]});
  sender.sendToClient(data.characters[characterId].accountId, request);

  request = new Request({type: MSG_TYPES.HOT_BAR_DATA, request: data.inventories[data.characters[characterId].hotBarId]});
  sender.sendToClient(data.characters[characterId].accountId, request);

  request = new Request({type: MSG_TYPES.ITEMS_LIST, request: data.items});
  sender.sendToClient(data.characters[characterId].accountId, request);

  request = new Request({type: MSG_TYPES.CRAFT, request: data.recipeList});
  sender.sendToClient(data.characters[characterId].accountId, request);

  request = new Request({type: MSG_TYPES.HUMAN_DATA, request: characterId});
  sender.sendAllExcept(request, data.characters[characterId].accountId);
  for (let key in data.characters) {
    if (+key !== characterId) {
      let founderCharacters = visibleObjects.findCharacters(data.characters, data.characters[key].viewDistance, key);
      let resultChatacter = null;
      for (let i = 0; i < founderCharacters.length; i++) {
        resultChatacter = new Array(founderCharacters[i].id, founderCharacters[i].column, founderCharacters[i].row, founderCharacters[i].left, founderCharacters[i].top, founderCharacters[i].direction);
        request = new Request({type: MSG_TYPES.HUMAN_MOVE, request: resultChatacter});
        sender.sendToClient(data.characters[characterId].accountId, request)

        resultChatacter = new Array(data.characters[characterId].id, data.characters[characterId].column, data.characters[characterId].row, data.characters[characterId].left, data.characters[characterId].top, data.characters[characterId].direction);
        request = new Request({type: MSG_TYPES.HUMAN_MOVE, request: resultChatacter});
        sender.sendToClient(data.characters[founderCharacters[i].id].accountId, request);
      }
    }
  }

  let surroundObjects = visibleObjects.surroundObjects(data.characters[characterId].column, data.characters[characterId].row, data.characters[characterId].viewDistance, data);
  if (surroundObjects[0].length>0){
    request = new Request({
      type: MSG_TYPES.MAP_OBJECT,
      request: surroundObjects[0]
    });
    sender.sendToClient(accountId, request);
  }
  if (surroundObjects[1].length>0){
    request = new Request({
      type: MSG_TYPES.BUILDING_OBJECT,
      request: surroundObjects[1]
    });
    sender.sendToClient(accountId, request);
  }
  if (surroundObjects[2].length>0){
    request = new Request({
      type: MSG_TYPES.MAP_LOOT,
      request: surroundObjects[2]
    });
    sender.sendToClient(accountId, request);
  }

  let surAnimals = visibleObjects.surroundAnimals(data.characters[characterId].column, data.characters[characterId].row, data.characters[characterId].viewDistance, data.animals);
  if (surAnimals.length > 0) {
    request = new Request({type: MSG_TYPES.NPC_DATA, request: surAnimals});
    sender.sendToClient(data.characters[characterId].accountId, request);
  }

  data.inventories[data.characters[characterId].inventoryId].addItem(data.stacks, 1, 60);
  // request = new Request({type:INVENTORY_CHANGE, request:stacks});
  // sender.sendToClient(data.characters[characterId].accountId, request);
  data.inventories[data.characters[characterId].inventoryId].addItem(data.stacks, 2, 60);
  data.inventories[data.characters[characterId].inventoryId].addItem(data.stacks, 5, 1);
  let allInventory = [];
  let mainInventory = data.inventories[data.characters[characterId].inventoryId];
  let hotBar = data.inventories[data.characters[characterId].hotBarId];
  let armorInventory = data.inventories[data.characters[characterId].armorInventoryId];
  for (let i = 0; i < mainInventory.stacks.length; i++) {
    if (data.stacks[mainInventory.stacks[i]].item !== null) {
      allInventory.push(data.stacks[mainInventory.stacks[i]])
    }
  }
  for (let i = 0; i < hotBar.stacks.length; i++) {
    if (data.stacks[hotBar.stacks[i]].item !== null) {
      allInventory.push(data.stacks[hotBar.stacks[i]])
    }
  }
  for (let i = 0; i < armorInventory.stacks.length; i++) {
    if (data.stacks[armorInventory.stacks[i]].item !== null) {
      allInventory.push(data.stacks[armorInventory.stacks[i]])
    }
  }
  if (allInventory.length === 0) return;
  request = new Request({type: MSG_TYPES.INVENTORY_CHANGE, request: allInventory});
  sender.sendToClient(data.characters[characterId].accountId, request);
}

module.exports = initialize;