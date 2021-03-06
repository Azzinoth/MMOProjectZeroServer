const Request = require('../Request');
const visibleObjects = require('../../gameData/visibleObjects');
const craftItem = require('../../gameData/craft/craftItem');
const Weapon = require('../../gameData/item/unique/Weapon');
const Range = require('../../gameData/item/unique/weapon/Range');
const Melee = require('../../gameData/item/unique/weapon/Melee');
const Lootable = require('../../gameData/mapItem/buildingPart/Lootable');
const Production = require('../../gameData/mapItem/buildingPart/lootable/Production');
const cellUtils = require('../../gameData/map/cellUtils');
const itemUtils = require('../../gameData/item/itemUtils');
const sender = require('../sender');
const collision = require('../../utils/collision');
const getTime = require('../../utils/getTime');
const log = require('../log');
const MSG_TYPES = require('../../constants/messageTypes');
const Location = require('../../gameData/Location');
const Character = require('../../gameData/person/Character');
const bubbleSort = require('../../utils/bubbleSort');
const Instruments = require ('../../gameData/item/unique/Instruments');
const initialize = require('../initialize');

function messageHandler(data, message, personId) {
  let characters = data.characters;
  let inventories = data.inventories;
  let stacks = data.stacks;
  let cellsMap = data.getMap();
  let items = data.items;
  let animals = data.animals;
  let resources = data.resources;
  let buildingParts = data.buildingParts;
  let json = JSON.parse(message);
  let column;
  let row;
  let request;

  log(json.type, message, false, personId);
  switch (json.type) {

    case MSG_TYPES.HUMAN_MOVE: {
      let direction = json.request;
      if (characters[personId].direction === -1)
        characters[personId].lastTick = getTime.getTimeInMs();

      request = new Request({type: MSG_TYPES.HUMAN_MOVE, request: new Array(personId, direction)});
      if (direction !== characters[personId].direction) {
        characters[personId].direction = direction;
        sender.sendByViewDistanceExcept(characters, request, characters[personId].column, characters[personId].row, characters[personId].accountId);
        characters[personId].tmpDistanceWalked = 0;
        request = new Request({
          type: MSG_TYPES.HUMAN_MOVE,
          request: new Array(personId, characters[personId].column, characters[personId].row, characters[personId].left, characters[personId].top, characters[personId].direction)
        });
        sender.sendToClient(characters[personId].accountId, request);
      }

    }
      break;
    case MSG_TYPES.GATHER: {

      column = characters[personId].column;
      row = characters[personId].row;
      let toColumn = json.request.column;
      let toRow = json.request.row;
      // let isGather;
      // let changedInventory;

      if (cellUtils.isGatheredCell(cellsMap, row, column, toRow, toColumn, resources)) {
        let stackId = characters[personId].activeHotBarCell;
        let mapCatalogId = cellsMap[toColumn][toRow].objectId;
        let isUseInstrument = false;
        if (stackId!==null && stacks[stackId].item instanceof (Instruments)){
          for (let i = 0; i<stacks[stackId].item.usableObjId.length; i++){
            if (stacks[stackId].item.usableObjId[i] === mapCatalogId){
              isUseInstrument = true;
              break;
            }
          }
        }
        if (!isUseInstrument&&stackId!==null)break;
        let mapItemId = cellsMap[toColumn][toRow].mapItemId;
        let items = resources[mapItemId].getLoot(data);
        let reqStacks = [];
        for (let i = 0; i < items.length; i++) {
          let addedStacks = inventories[data.characters[personId].inventoryId].addItem(stacks, items[i][0], items[i][1]);
          reqStacks = reqStacks.concat(addedStacks);
        }
        if (reqStacks.length > 0) {
          cellsMap[toColumn][toRow].objectId = null;
          cellsMap[toColumn][toRow].movable = true;
          //delete reqStacks.isFull;
          // request = requestInventory (characters[personId].inventoryId, reqStacks, Object.getOwnPropertyNames(reqStacks).length);
          request = new Request({type: MSG_TYPES.INVENTORY_CHANGE, request: reqStacks});
          sender.sendToClient(characters[personId].accountId, request);

          let tmpArray = [new Array(cellsMap[toColumn][toRow].column, cellsMap[toColumn][toRow].row, cellsMap[toColumn][toRow].objectId)];
          request = new Request({type: MSG_TYPES.MAP_OBJECT, request: tmpArray});
          sender.sendByViewDistance(characters, request, toColumn, toRow);
        } else {
          request = new Request({type: MSG_TYPES.SYSTEM_MESSAGE, request: 'Full inventory!'});
          sender.sendToClient(characters[personId].accountId, request);
        }
      } else {
        request = new Request({type: MSG_TYPES.SYSTEM_MESSAGE, request: 'Can not gather!'});
        sender.sendToClient(characters[personId].accountId, request);
      }
    }
      break;
    case MSG_TYPES.HUMAN_UPDATE: {
      let founderCharacters = visibleObjects.findCharacters(characters, characters[personId].viewDistance, personId);
      let resultCharacter = null;
      for (let i = 0; i < founderCharacters.length; i++) {
        resultCharacter = new Array(founderCharacters[i].id, founderCharacters[i].column, founderCharacters[i].row, founderCharacters[i].left, founderCharacters[i].top, founderCharacters[i].direction);
        sender.sendToClient(characters[personId].accountId, new Request({
          type: MSG_TYPES.HUMAN_MOVE,
          request: resultCharacter
        }));
      }
      request = new Request({
        type: MSG_TYPES.HUMAN_MOVE,
        request: new Array(characters[personId].id, characters[personId].column, characters[personId].row, characters[personId].left, characters[personId].top, characters[personId].direction)
      });
      sender.sendToClient(characters[personId].accountId, request);
    }
      break;
    case MSG_TYPES.INVENTORY_CHANGE: {
      let indexFrom = json.request[0];
      let indexTo = json.request[1];
      let objectFrom = null;
      let objectTo = null;
      for (let key in data.buildingParts) {
        if (data.buildingParts[key].inventoryId === data.stacks[indexFrom].inventoryId)
          objectFrom = data.buildingParts[key];
        if (indexTo !== -1 && data.buildingParts[key].inventoryId === data.stacks[indexTo].inventoryId)
          objectTo = data.buildingParts[key];
      }
      if (objectFrom===null && objectTo===null){
        for (let key in data.mapLoots) {
          if (data.mapLoots[key].inventoryId === data.stacks[indexFrom].inventoryId)
            objectFrom = data.mapLoots[key];
          if (indexTo !== -1 && data.mapLoots[key].inventoryId === data.stacks[indexTo].inventoryId)
            objectTo = data.mapLoots[key];
        }
      }

      if (objectFrom === null && objectTo === null) {
        if (stacks[indexFrom].inventoryId !== characters[personId].inventoryId && stacks[indexFrom].inventoryId !== characters[personId].hotBarId) break;
        if (indexTo !== -1 && stacks[indexTo].inventoryId !== characters[personId].inventoryId && stacks[indexTo].inventoryId !== characters[personId].hotBarId) break;
      } else if (objectFrom !== null && objectTo !== null) {
        if (objectFrom.inventoryId !== objectTo.inventoryId) break;
        if (!cellUtils.isNearCell(objectFrom.location.column, objectFrom.location.row, characters[personId].column, characters[personId].row, 1)) break;
      } else if (objectFrom !== null) {
        if (indexTo !== -1 && stacks[indexTo].inventoryId !== characters[personId].inventoryId && stacks[indexTo].inventoryId !== characters[personId].hotBarId) break;
        if (!cellUtils.isNearCell(objectFrom.location.column, objectFrom.location.row, characters[personId].column, characters[personId].row, 1)) break;
      } else if (objectTo !== null) {
        if (stacks[indexFrom].inventoryId !== characters[personId].inventoryId && stacks[indexFrom].inventoryId !== characters[personId].hotBarId) break;
        if (!cellUtils.isNearCell(objectTo.location.column, objectTo.location.row, characters[personId].column, characters[personId].row, 1)) break;
      }
      let item = stacks[indexFrom].item;
      if (item === null) break;
      let toInventory = null;
      if (indexTo !== -1) toInventory = inventories[stacks[indexTo].inventoryId];

      let swaps = inventories[stacks[indexFrom].inventoryId].swapStack(stacks, indexFrom, indexTo);

      if (swaps !== 1) {
        request = new Request({type: MSG_TYPES.INVENTORY_CHANGE, request: swaps});
        sender.sendToClient(characters[personId].accountId, request);
      }
    }
      break;
    case MSG_TYPES.INVENTORY_ALL: {
      let inventoryIdFrom = json.request[0];
      let inventoryIdTo = json.request[1];
      let lootableObjectFrom = data.inventories[inventoryIdFrom].findOwner(data);
      let lootableObjectTo = data.inventories[inventoryIdTo].findOwner(data);
      let result = [];
      if (lootableObjectFrom === null || lootableObjectTo === null) return;
      if (lootableObjectFrom instanceof (Character) && data.characters[personId].inventoryId === inventoryIdFrom) {
        if (!cellUtils.isNearCell(data.characters[personId].column, data.characters[personId].row, lootableObjectTo.location.column, lootableObjectTo.location.row, data.characters[personId].viewDistance)) return;
        result = data.inventories[inventoryIdTo].addAllFromInventory(data.inventories[inventoryIdFrom], data.stacks);
      }else if (lootableObjectTo instanceof (Character) && data.characters[personId].inventoryId === inventoryIdTo){
        if (!cellUtils.isNearCell(data.characters[personId].column, data.characters[personId].row, lootableObjectFrom.location.column, lootableObjectFrom.location.row, data.characters[personId].viewDistance)) return;
        result = data.inventories[inventoryIdTo].addAllFromInventory(data.inventories[inventoryIdFrom], data.stacks);
      } else break;

      if (result.length === 0) break;
      request = new Request({type: MSG_TYPES.INVENTORY_CHANGE, request: result});
      sender.sendToClient(characters[personId].accountId, request);
    }
      break;
    case MSG_TYPES.CRAFT: {
      let craftId = +json.request;
      let craftRecipes = characters[personId].craftRecipesId;

      for (let i = 0; i < craftRecipes.length; i++) {
        if (craftRecipes[i] === craftId) {
          let craftResult = craftItem(inventories[characters[personId].inventoryId], stacks, data.recipeList[craftRecipes[i]], items);
          if (craftResult !== 1 && craftResult !== 2 && craftResult !== 3) {
            craftResult = craftResult.concat(inventories[characters[personId].inventoryId].addItem(stacks, data.recipeList[craftRecipes[i]].craftedTypeId, data.recipeList[craftRecipes[i]].outputAmount));
            request = new Request({type: MSG_TYPES.INVENTORY_CHANGE, request: craftResult});
            sender.sendToClient(characters[personId].accountId, request);
          }
          break;
        }
      }
    }
      break;
    case MSG_TYPES.PLACE_ON_MAP: {
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
      //let mapItemId = data.getId('mapItem');
      let catalogId = null;
      for (let key in data.mapItemsCatalog) {
        if (data.mapItemsCatalog[key].typeId === typeId) {
          catalogId = parseInt(key);
          break;
        }
      }
      let mapObj = itemUtils.createMapItem(catalogId, personId, new Location(column, row, column * 64, row * 64));
      data.buildingParts[mapObj.mapItemId] = mapObj;
      cellsMap[column][row].mapItemId = mapObj.mapItemId;
      cellsMap[column][row].objectId = catalogId;
      inventoryId = null;
      let isActive = null;
      if (mapObj instanceof (Lootable)) inventoryId = mapObj.inventoryId;
      if (mapObj instanceof (Production)) isActive = mapObj.isInAction;

      let result = [new Array(catalogId, mapObj.mapItemId, column, row, inventoryId, isActive, mapObj.characterId)];
      request = new Request({type: MSG_TYPES.BUILDING_OBJECT, request: result});
      sender.sendByViewDistance(characters, request, column, row);

      sender.sendToClient(characters[personId].accountId, new Request({
        type: MSG_TYPES.INVENTORY_CHANGE,
        request: new Array(stacks[stackId])
      }));
    }
      break;
    case MSG_TYPES.SHOT: {
      let toX = json.request[0];
      let toY = json.request[1];
      if (characters[personId].activeHotBarCell === null || stacks[characters[personId].activeHotBarCell].item === null) break;
      let stackId = characters[personId].activeHotBarCell;
      if (!(stacks[stackId].item instanceof (Weapon))) break;
      if (stacks[stackId].item instanceof (Range)&&stacks[stackId].item.isReloaded && stacks[stackId].item.currentMagazine === 0) {
        let quantity = stacks[stackId].item.magazineSize - stacks[stackId].item.currentMagazine;
        let findAmmo = data.inventories[data.characters[personId].inventoryId].findItems(stacks[stackId].item.ammoId, stacks);
        let removeItems = null;
        if (findAmmo[0] === 0)break;
        if (findAmmo[0] < quantity)quantity = findAmmo[0];
        removeItems = data.inventories[data.characters[personId].inventoryId].removeItem(stacks, stacks[stackId].item.ammoId, quantity);
        stacks[stackId].item.reloadWeapon(quantity);
        sender.sendToClient(characters[personId].accountId, new Request({
          type: MSG_TYPES.INVENTORY_CHANGE,
          request: removeItems
        }));
        break;
      }
      let firedAmmo  = stacks[stackId].item.shot(data.firedAmmos, personId, characters[personId].left, characters[personId].top, toX, toY);

      if (firedAmmo === null) break;
      let arr = [5];
      arr[0] = firedAmmo.characterId;
      arr[1] = firedAmmo.initialX;
      arr[2] = firedAmmo.initialY;
      arr[3] = firedAmmo.finalX;
      arr[4] = firedAmmo.finalY;
      sender.sendByViewDistance(data.characters, new Request({type: MSG_TYPES.SHOT, request: arr}), characters[personId].column, characters[personId].row);

    }
      break;
    case MSG_TYPES.HOT_BAR_CHANGE: {
      let indexFrom = json.request[0];
      let indexTo = json.request[1];
      let item = stacks[inventories[characters[personId].inventoryId].stacks[indexFrom]].item;
      if (stacks[indexFrom].inventoryId!==characters[personId].inventoryId&&stacks[indexFrom].inventoryId!==characters[personId].hotBarId) break;
      if (indexTo!==-1&&stacks[indexTo].inventoryId!==characters[personId].inventoryId&&stacks[indexTo].inventoryId!==characters[personId].hotBarId)break;
      if (item === null) break;
      let swaps = inventories[characters[personId].inventoryId].swapStack(stacks, indexFrom, indexTo);

      if (swaps !== 1) {
        request = new Request({type: MSG_TYPES.INVENTORY_CHANGE, request: swaps});
        sender.sendToClient(characters[personId].accountId, request);
      }
    }
      break;
    case MSG_TYPES.RELOAD_WEAPON: {
      if (characters[personId].activeHotBarCell === null || stacks[characters[personId].activeHotBarCell].item === null) break;
      let stackId = characters[personId].activeHotBarCell;
      if (stacks[stackId].item.typeName !== 'WEAPON' || !stacks[stackId].item.isReloaded) break;
      let quantity = stacks[stackId].item.magazineSize - stacks[stackId].item.currentMagazine;
      if (quantity === 0) break;
      let findAmmo = data.inventories[data.characters[personId].inventoryId].findItems(stacks[stackId].item.ammoId, stacks);
      //let tmp = data.inventories[data.characters[personId].hotBarId].findItems(stacks[stackId].item.ammoId, stacks);
      //findAmmo[0] += tmp[0];
      //findAmmo[1] = findAmmo[1].concat(tmp[1]);
      if (findAmmo[0] === 0)break;
      //if (findAmmo[1].length>1)findAmmo[1] = bubbleSort.bubbleSort(findAmmo[1]);

      if (findAmmo[0] < quantity) quantity = findAmmo[0];
      let removeItems = data.inventories[data.characters[personId].inventoryId].removeItem(stacks, stacks[stackId].item.ammoId, quantity);
      stacks[stackId].item.reloadWeapon(quantity);
      sender.sendToClient(characters[personId].accountId, new Request({
        type: MSG_TYPES.INVENTORY_CHANGE,
        request: removeItems
      }));
    }
      break;
    case MSG_TYPES.HOT_BAR_CELL_ACTIVATE: {
      let stackId = json.request;
      if (stacks[stackId].inventoryId !== characters[personId].hotBarId) break;
      characters[personId].activeHotBarCell = stackId;
    }
      break;
    case MSG_TYPES.LOOTING: {
      let mapItemId = json.request;
      let column = null;
      let row = null;
      let object = null;
      if (data.mapLoots.hasOwnProperty(mapItemId)) {
        column = data.mapLoots[mapItemId].location.column;
        row = data.mapLoots[mapItemId].location.row;
        object = data.mapLoots[mapItemId];
      }
      if (data.buildingParts.hasOwnProperty(mapItemId)) {
        column = data.buildingParts[mapItemId].location.column;
        row = data.buildingParts[mapItemId].location.row;
        object = data.buildingParts[mapItemId];
      }

      if (object === null ||
        !cellUtils.isNearCell(column, row, characters[personId].column, characters[personId].row, 1)) return;

      sender.sendToClient(data.characters[personId].accountId, new Request({
        type: MSG_TYPES.INVENTORY_DATA,
        request: data.inventories[object.inventoryId]
      }));
      let inventoryId = object.inventoryId;
      let result = [];
      for (let i = 0; i < data.inventories[inventoryId].stacks.length; i++) {
        result.push(data.stacks[data.inventories[inventoryId].stacks[i]]);
      }
      sender.sendToClient(characters[personId].accountId, new Request({
        type: MSG_TYPES.INVENTORY_CHANGE,
        request: result
      }));
    }
      break;
    case MSG_TYPES.USE: {
     let mapItemId = json.request;
      if (!data.buildingParts.hasOwnProperty(mapItemId) || !cellUtils.isNearCell(data.buildingParts[mapItemId].location.column, data.buildingParts[mapItemId].location.row, characters[personId].column, characters[personId].row, 1)) break;
      if (data.buildingParts[mapItemId] instanceof (Production)){
        let res = data.buildingParts[mapItemId].onOff(inventories[data.buildingParts[mapItemId].inventoryId], stacks);
        if (res[0]){
          request = new Request({type:MSG_TYPES.USE, request:new Array(mapItemId, data.buildingParts[mapItemId].isInAction)});
          sender.sendByViewDistance(characters, request, data.buildingParts[mapItemId].location.column, data.buildingParts[mapItemId].location.row);
        }
        if (res[1].length>0){
          request = new Request({
            type: MSG_TYPES.INVENTORY_CHANGE,
            request: res[1]
          });
          sender.sendByViewDistance(data.characters, request, data.buildingParts[mapItemId].location.column, data.buildingParts[mapItemId].location.row);
        }
      }
    }
      break;
    case MSG_TYPES.RESPAWN: {
      data.characters[personId].respawn(data);
    }
    case MSG_TYPES.CHAT_ALL: {
      let nickName = null;
      for(let key in data.accounts){
        if (data.accounts[key].id === data.characters[personId].accountId){
          nickName = data.accounts[key].email;
          break;
        }
      }
      request = new Request({type:MSG_TYPES.CHAT_ALL, request:new Array(nickName, json.request)});
      sender.sendToAll(data.characters, request);
    }
      break;
    case MSG_TYPES.SYSTEM_MESSAGE: {
      console.log(json.request);

    }
      break;
    case MSG_TYPES.PING: {
      sender.sendToClient(characters[personId].accountId, new Request({type: MSG_TYPES.PING, request: null}));
    }
      break;
  }
}

module.exports = messageHandler;