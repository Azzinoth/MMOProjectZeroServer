const stackUtils = require('../../gameData/inventory/stackUtils');
const Request = require('../Request');
const visibleObjects = require('../../gameData/visibleObjects');
const craftItem = require('../../gameData/craft/craftItem');
const Weapon = require('../../gameData/item/unique/Weapon');
const cellUtils = require('../../gameData/map/cellUtils');
const itemUtils = require('../../gameData/item/itemUtils');
const sender = require('../sender');
const collision = require('../../utils/collision');
const getTime = require('../../utils/getTime');
const width = 48 * 3;
const height = 48 * 3;
const {
  SESSION_ID,
  HUMAN_DATA,
  HUMAN_MOVE,
  HUMAN_UPDATE,
  HUMAN_DELETE,
  GATHER,
  MAP_OBJECT,
  ERROR,
  INVENTORY_CHANGE,
  CRAFT,
  ITEMS_LIST,
  PLACE_ON_MAP,
  SYSTEM_MESSAGE,
  SHOT,
  NPC_MOVE,
  HOT_BAR_CHANGE,
  HOT_BAR_CELL_ACTIVATE,
  NPC_DATA,
  RELOAD_WEAPON,
  PING,
  LOOTING
} = require('../../constants').messageTypes;

function messageHandler(data, message, personId) {
  let characters = data.characters;
  let inventories = data.inventories;
  let stacks = data.stacks;
  let cellsMap = data.getMap();
  let items = data.items;
  // let items = data.items;
  // let commonItems = data.commonItems;
  let animals = data.animals;
  let resources = data.resources;
  let buildingParts = data.buildingParts;
  let json = JSON.parse(message);
  let column;
  let row;
  let request;
  if (json.type !== HUMAN_UPDATE && json.type !== HUMAN_MOVE && json.type !== PING) console.log(message);

  switch (json.type) {

    case HUMAN_MOVE: {
      let direction = json.request;
      if (characters[personId].direction === -1)
        characters[personId].lastTick = getTime.getTimeInMs();

      request = new Request({type: HUMAN_MOVE, request: new Array(personId, direction)});
      if (direction !== characters[personId].direction) {
        characters[personId].direction = direction;
        sender.sendByViewDistanceExcept(characters, request, characters[personId].column, characters[personId].row, characters[personId].accountId);
        characters[personId].tmpDistanceWalked = 0;
        request = new Request({
          type: HUMAN_MOVE,
          request: new Array(personId, characters[personId].column, characters[personId].row, characters[personId].left, characters[personId].top, characters[personId].direction)
        });
        sender.sendToClient(characters[personId].accountId, request);
      }

    }
      break;
    case GATHER: {

      column = characters[personId].column;
      row = characters[personId].row;
      let toColumn = json.request.column;
      let toRow = json.request.row;
      // let isGather;
      // let changedInventory;

      if (cellUtils.isGatheredCell(cellsMap, row, column, toRow, toColumn, resources)) {
        let mapItemId = cellsMap[toColumn][toRow].mapItemId;
        let items = resources[mapItemId].getLoot(data);
        let reqStacks = [];
        for (let i = 0; i < items.length; i++) {
          let addedStacks = stackUtils.addStack(inventories, characters[personId], stacks, items[i][0], items[i][1]);
          reqStacks = reqStacks.concat(addedStacks);
        }
        if (reqStacks.length > 0) {
          cellsMap[toColumn][toRow].objectId = null;
          cellsMap[toColumn][toRow].movable = true;
          //delete reqStacks.isFull;
          // request = requestInventory (characters[personId].inventoryId, reqStacks, Object.getOwnPropertyNames(reqStacks).length);
          request = new Request({type: INVENTORY_CHANGE, request: reqStacks});
          sender.sendToClient(characters[personId].accountId, request);

          let tmpArray = [new Array(cellsMap[toColumn][toRow].column, cellsMap[toColumn][toRow].row, cellsMap[toColumn][toRow].objectId)];
          request = new Request({type: MAP_OBJECT, request: tmpArray});
          sender.sendByViewDistance(characters, request, toColumn, toRow);
        } else {
          request = new Request({type: SYSTEM_MESSAGE, request: 'Full inventory!'});
          sender.sendToClient(characters[personId].accountId, request);
        }
      } else {
        request = new Request({type: SYSTEM_MESSAGE, request: 'Can not gather!'});
        sender.sendToClient(characters[personId].accountId, request);
      }
    }
      break;
    case HUMAN_UPDATE: {
      let founderCharacters = visibleObjects.findCharacters(characters, characters[personId].viewDistance, personId);
      let resultCharacter = null;
      for (let i = 0; i < founderCharacters.length; i++) {
        resultCharacter = new Array(founderCharacters[i].id, founderCharacters[i].column, founderCharacters[i].row, founderCharacters[i].left, founderCharacters[i].top, founderCharacters[i].direction);
        sender.sendToClient(characters[personId].accountId, new Request({type: HUMAN_MOVE, request: resultCharacter}));
      }
      request = new Request({
        type: HUMAN_MOVE,
        request: new Array(characters[personId].id, characters[personId].column, characters[personId].row, characters[personId].left, characters[personId].top, characters[personId].direction)
      });
      sender.sendToClient(characters[personId].accountId, request);
    }
      break;
    case INVENTORY_CHANGE: {
      let indexFrom = json.request[0];
      let indexTo = json.request[1];

      if (stacks[indexFrom].inventoryId !== characters[personId].inventoryId && stacks[indexFrom].inventoryId !== characters[personId].hotBarId) break;
      if (indexTo !== -1 && stacks[indexTo].inventoryId !== characters[personId].inventoryId && stacks[indexTo].inventoryId !== characters[personId].hotBarId) break;

      let item = stacks[indexFrom].item;
      if (item === null) break;
      let toInventory = null;
      if (indexTo !== -1) toInventory = inventories[stacks[indexTo].inventoryId];

      let swaps = stackUtils.swapStack(inventories[stacks[indexFrom].inventoryId], toInventory, stacks, indexFrom, indexTo);

      if (swaps !== 1) {
        request = new Request({type: INVENTORY_CHANGE, request: swaps});
        sender.sendToClient(characters[personId].accountId, request);
      }
    }
      break;
    case CRAFT: {
      let craftId = +json.request;
      let craftRecipes = characters[personId].craftRecipesId;

      for (let i = 0; i < craftRecipes.length; i++) {
        if (craftRecipes[i] === craftId) {
          let invent = craftItem(inventories, characters[personId], stacks, data.recipeList[craftRecipes[i]], items);
          if (invent !== 1 && invent !== 2 && invent !== 3) {
            request = new Request({type: INVENTORY_CHANGE, request: invent});
            sender.sendToClient(characters[personId].accountId, request);
          }
        }
      }
    }
      break;
    case PLACE_ON_MAP: {
      let stackId = json.request[0];

      column = json.request[1][0];
      row = json.request[1][1];
      let inventoryId = stacks[stackId].inventoryId;
      if (stacks[stackId].item === null || (characters[personId].inventoryId !== inventoryId && characters[personId].hotBarId !== inventoryId)) break;
      if (stacks[stackId].item.typeName !== 'BUILDING_PART') break;
      let typeId = stacks[stackId].item.typeId;
      if (!cellUtils.isBuilderCell(cellsMap, column, row)) break;
      if (stacks[stackId].size > 1) stacks[stackId].size--;
      else {
        delete stacks[stackId].item;
        stacks[stackId].item = null;
        stacks[stackId].size = null;
      }

      cellsMap[column][row].movable = false;
      let mapItemId = data.getId('mapItem');
      let catalogId = null;
      for (let key in data.mapItemsCatalog) {
        if (data.mapItemsCatalog[key].typeId === typeId) {
          catalogId = parseInt(key);
          break;
        }
      }
      data.buildingParts[mapItemId] = itemUtils.createMapItem(catalogId, mapItemId, personId);
      cellsMap[column][row].mapItemId = mapItemId;
      cellsMap[column][row].objectId = catalogId;
      let result = [new Array(cellsMap[column][row].column, cellsMap[column][row].row, cellsMap[column][row].objectId)];
      request = new Request({type: MAP_OBJECT, request: result});
      sender.sendByViewDistance(characters, request, column, row);

      sender.sendToClient(characters[personId].accountId, new Request({
        type: INVENTORY_CHANGE,
        request: new Array(stacks[stackId])
      }));


    }
      break;
    case SHOT: {
      let toX = json.request[0];
      let toY = json.request[1];
      let firedAmmos = data.firedAmmos;
      if (characters[personId].activeHotBarCell === null || stacks[characters[personId].activeHotBarCell].item === null) break;
      let stackId = characters[personId].activeHotBarCell;
      if (stacks[stackId].item.typeName !== 'WEAPON') break;


      if (stacks[stackId].item.isReloaded && stacks[stackId].item.currentMagazine === 0) {
        let quantity = stacks[stackId].item.magazineSize - stacks[stackId].item.currentMagazine;
        let findAmmo = stackUtils.findItems(stacks[stackId].item.ammoId, inventories, characters[personId], stacks);
        if (findAmmo[0] == 0) break;
        if (findAmmo[0] < quantity) quantity = findAmmo[0];
        let removeItems = stackUtils.removeItems(quantity, findAmmo[1]);
        stacks[stackId].item.reloadWeapon(quantity);
        sender.sendToClient(characters[personId].accountId, new Request({
          type: INVENTORY_CHANGE,
          request: removeItems
        }));
        break;
      }
      let firedAmmo = stacks[stackId].item.shot(firedAmmos, personId, characters[personId].left, characters[personId].top, toX, toY);

      if (firedAmmo === null) break;
      let arr = [5];
      arr[0] = firedAmmo.characterId;
      arr[1] = firedAmmo.initialX;
      arr[2] = firedAmmo.initialY;
      arr[3] = firedAmmo.finalX;
      arr[4] = firedAmmo.finalY;
      sender.sendToAll(new Request({type: SHOT, request: arr}));

    }
      break;
    case HOT_BAR_CHANGE: {
      let indexFrom = json.request[0];
      let indexTo = json.request[1];
      let item = stacks[inventories[characters[personId].inventoryId].stacks[indexFrom]].item;

      if (item === null) break;
      let swaps;
      if (indexTo == -1) {
        swaps = stackUtils.swapStack(inventories[characters[personId].hotBarId], null, stacks, indexFrom, indexTo);
      } else {
        swaps = stackUtils.swapStack(inventories[characters[personId].inventoryId], inventories[characters[personId].hotBarId], stacks, indexFrom, indexTo);
      }

      if (swaps !== 1) {
        request = new Request({type: INVENTORY_CHANGE, request: swaps});
        sender.sendToClient(characters[personId].accountId, request);
      }
    }
      break;
    case RELOAD_WEAPON: {
      if (characters[personId].activeHotBarCell === null || stacks[characters[personId].activeHotBarCell].item === null) break;
      let stackId = characters[personId].activeHotBarCell;
      if (stacks[stackId].item.typeName !== 'WEAPON' || !stacks[stackId].item.isReloaded) break;
      let quantity = stacks[stackId].item.magazineSize - stacks[stackId].item.currentMagazine;
      if (quantity === 0) break;
      let findAmmo = stackUtils.findItems(stacks[stackId].item.ammoId, inventories, characters[personId], stacks);
      if (findAmmo[0] == 0) break;
      if (findAmmo[0] < quantity) quantity = findAmmo[0];
      let removeItems = stackUtils.removeItems(quantity, findAmmo[1]);
      stacks[stackId].item.reloadWeapon(quantity);
      sender.sendToClient(characters[personId].accountId, new Request({type: INVENTORY_CHANGE, request: removeItems}));
    }
      break;
    case HOT_BAR_CELL_ACTIVATE: {
      let stackId = json.request;
      if (stacks[stackId].inventoryId !== characters[personId].hotBarId) break;
      characters[personId].activeHotBarCell = stackId;
    }
      break;
    case LOOTING: {
      let mapItemId = json.request[0];
      let column = json.request[1];
      let row = json.request[2];
      if (data.getMap[column][row].mapItemId!==mapItemId ||
        !data.mapLoots.hasOwnProperty(mapItemId) ||
        !cellUtils.isNearCell(column, row, characters[personId].column, characters[personId].row, 1)) return;
      let mapInventoryId = data.mapLoots[mapItemId].inventoryId;
      let result = [];
      for (let i = 0; i< data.mapInventories[mapInventoryId].stacks.length; i++){
        result.push(data.mapStacks[data.mapInventories[mapInventoryId].stacks[i]]);
      }
      sender.sendToClient(characters[personId].accountId, new Request({type: LOOTING, request: new Array(mapInventoryId, result)}));
    }
      break;
    case SYSTEM_MESSAGE: {
      console.log(json.request);

    }
      break;
    case PING: {
      sender.sendToClient(characters[personId].accountId, new Request({type: PING, request: null}));
    }
      break;
  }
}

module.exports = messageHandler;