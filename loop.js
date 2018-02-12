const Request = require('./network/Request');
const sender = require('./network/sender');
const collision = require('./utils/collision');
const constants = require('./constants/constans');
const getTime = require('./utils/getTime');
const visibleObjects = require('./gameData/visibleObjects');
const cellUtils = require('./gameData/map/cellUtils');
const initialize = require('./network/initialize');
const MapLoot = require('./gameData/mapItem/MapLoot');
const Production = require('./gameData/mapItem/buildingPart/lootable/Production');
const Location = require('./gameData/Location');
const Coward = require('./gameData/npc/animals/Coward');
const Passive = require('./gameData/npc/animals/Passive');
const MSG_TYPES = require('./constants/messageTypes');
let startTime;
let finishTime;
let frameTime;

function mainLoop(data) {
  setInterval(function () {
    startTime = getTime.getTimeInMs();
    moveCharacters(data);
    fire(data);
    moveNpc(data);
    buildingsAction(data);
    // for (let i=0; i<7000; i++){
    //     moveNpc(data);
    // }
    finishTime = getTime.getTimeInMs();
    frameTime = finishTime - startTime;

    if (frameTime > 20) {
      console.log('Frame: ' + frameTime);
    }
  }, 17);
}
function buildingsAction(data) {
  let request = null;
  for (let key in data.buildingParts) {
    if (data.buildingParts[key] instanceof (Production)&&data.buildingParts[key].isInAction){
      let productStacks = data.buildingParts[key].tick(data.inventories[data.buildingParts[key].inventoryId], data.stacks, data.recipeList, data.items);
      if (productStacks[0]){
        request = new Request({
          type: MSG_TYPES.USE,
          request: new Array(key, data.buildingParts[key].isInAction)
        });
        sender.sendByViewDistance(data.characters, request, data.buildingParts[key].location.column, data.buildingParts[key].location.row);
      }else if (productStacks[1].length>0){
        request = new Request({
          type: MSG_TYPES.INVENTORY_CHANGE,
          request: productStacks[1]
        });
        sender.sendByViewDistance(data.characters, request, data.buildingParts[key].location.column, data.buildingParts[key].location.row);
      }
    }
  }
}
function moveCharacters(data) {
  let request;
  for (let key in data.characters) {
    if (data.characters[key].isAlive && data.characters[key].isOnline && data.characters[key].direction !== -1) {
      let column = data.characters[key].column;
      let row = data.characters[key].row;
      let changedCell = data.characters[key].getNewCoord();
      let toColumn = Math.floor(changedCell[0] / constants.cellSize);
      let toRow = Math.floor(changedCell[1] / constants.cellSize);
      let isMove = data.characters[key].move(data.getMap(), changedCell[0], changedCell[1], toColumn, toRow);
      if ((column !== toColumn || row !== toRow)&&isMove) {
        let surrAnimals = visibleObjects.surroundAnimals(data.characters[key].column, data.characters[key].row, data.characters[key].viewDistance, data.animals);
        request = new Request({type: MSG_TYPES.NPC_DATA, request: surrAnimals});
        sender.sendToClient(data.characters[key].accountId, request);

        let founderCharacters = visibleObjects.findCharacters(data.characters, data.characters[key].viewDistance, key);
        let resultChatacter = null;
        for (let i = 0; i < founderCharacters.length; i++) {
          resultChatacter = new Array(founderCharacters[i].id, founderCharacters[i].column, founderCharacters[i].row, founderCharacters[i].left, founderCharacters[i].top, founderCharacters[i].direction);
          sender.sendToClient(data.characters[key].accountId, new Request({
            type: MSG_TYPES.HUMAN_MOVE,
            request: resultChatacter
          }));
          resultChatacter = new Array(data.characters[key].id, data.characters[key].column, data.characters[key].row, data.characters[key].left, data.characters[key].top, data.characters[key].direction);
          sender.sendToClient(data.characters[founderCharacters[i].id].accountId, new Request({
            type: MSG_TYPES.HUMAN_MOVE,
            request: resultChatacter
          }));
        }

        let surroundObjects = visibleObjects.surroundObjects(data.characters[key].column, data.characters[key].row, data.characters[key].viewDistance, data);
        if (surroundObjects[0].length>0){
          request = new Request({
            type: MSG_TYPES.MAP_OBJECT,
            request: surroundObjects[0]
          });
          sender.sendToClient(data.characters[key].accountId, request);
        }
        if (surroundObjects[1].length>0){
          request = new Request({
            type: MSG_TYPES.BUILDING_OBJECT,
            request: surroundObjects[1]
          });
          sender.sendToClient(data.characters[key].accountId, request);
        }
        if (surroundObjects[2].length>0){
          request = new Request({
            type: MSG_TYPES.MAP_LOOT,
            request: surroundObjects[2]
          });
          sender.sendToClient(data.characters[key].accountId, request);
        }
      }
      //data.characters[key].lastTick = getTime.getTimeInMs();
      //data.characters[key].move(changedCell[0], changedCell[1], toColumn, toRow);

    }

  }
}

function moveNpc(data) {
  let result = [];
  let request = null;
  for (let key in data.animals) {
    let fromColumn = data.animals[key].location.column;
    let fromRow = data.animals[key].location.row;
    // if (key==11){
    //   let request = new Request({type:MSG_TYPES.TEST_DATA, request:new Array(data.animals[key].location.left,data.animals[key].location.top)})
    //   sender.sendToAll(data.characters, request);
    // }
    // if (!data.animals[key].isAlive) {
    //   data.animals[key].timeToResurrection--;
    //   if (data.animals[key].timeToResurrection <= 0) {
    //     data.animals[key].resurrect(data.zones);
    //   }
    //   continue;
    // }
    //result.push(new Array(data.animals[key].location.left, data.animals[key].location.top));
    // if (data.animals[key].zoneId === null) {
    //   data.animals[key].randZone();
    // }
    let actionResult = data.animals[key].checkActionTick(data.characters);
    if (actionResult === 1){
      characterHit(data, data.animals[key].targetId, data.animals[key].damage, null);
    }else if (actionResult === 2){
      result = new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].speed);
      request = new Request({type: MSG_TYPES.NPC_MOVE, request: result});
      sender.sendByViewDistance(data.characters, request, data.animals[key].location.column, data.animals[key].location.row);
    }
    let tickResult = data.animals[key].animalTick(data.getMap(), data.zones);
    if (tickResult===1){
      result = [];
      result.push(new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].location.left, data.animals[key].location.top, data.animals[key].type, data.animals[key].speed));
      request = new Request({type: MSG_TYPES.NPC_DATA, request: result});
      sender.sendByViewDistance(data.characters, request, data.animals[key].location.column, data.animals[key].location.row);
    }else if (tickResult===2){
      result = new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].speed);
      request = new Request({type: MSG_TYPES.NPC_MOVE, request: result});
      sender.sendByViewDistance(data.characters, request, data.animals[key].location.column, data.animals[key].location.row);
    }
    // if (data.animals[key].destination === null) {
    //   data.animals[key].chooseNewDestination();
    // }
    // if (data.animals[key].destination !== null && data.animals[key].path.length === 0) {
    //
    //   data.animals[key].findPath(data.getMap());
    //   if (data.animals[key].path.length > 0) {
    //     result = new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].speed);
    //     sender.sendByViewDistance(data.characters, new Request({
    //       type: MSG_TYPES.NPC_MOVE,
    //       request: result
    //     }), data.animals[key].location.column, data.animals[key].location.row);
    //   }
    // }

    //data.animals[key].move(data.getMap());
    let toColumn = data.animals[key].location.column;
    let tomRow = data.animals[key].location.row;

    if (fromColumn!==toColumn || fromRow!==tomRow) {
      result = [];
      for (let key2 in data.characters) {
        if (data.characters[key2].isOnline&&data.characters[key2].isAlive) {
          let isNewVisible = visibleObjects.isNewObjectInViewDistance(data.characters[key2].left, data.characters[key2].top, fromColumn * constants.cellSize+32, fromRow * constants.cellSize+32, data.animals[key].location.left, data.animals[key].location.top, data.characters[key2].viewDistance);
          if (isNewVisible) {
            result.push(new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].location.left, data.animals[key].location.top, data.animals[key].type, data.animals[key].speed));
            sender.sendToClient(data.characters[key2].accountId, new Request({
              type: MSG_TYPES.NPC_DATA,
              request: result
            }));
            result = [];
          }
        }
      }
    }
  }
  // if (result.length>0)
}

function fire(data) {
  let firedAmmos = data.firedAmmos;
  for (let i = 0; i < firedAmmos.length; i++) {
    if (firedAmmos[i].active) {

      let time = new Date().getTime();
      firedAmmos[i].currentTick = time;
      firedAmmos[i].timePassed += firedAmmos[i].currentTick - firedAmmos[i].lastTick;
      firedAmmos[i].lastTick = time;
      let fromColumn = Math.floor(firedAmmos[i].x / constants.cellSize);
      let fromRow = Math.floor(firedAmmos[i].y / constants.cellSize);
      firedAmmos[i].x = parseInt(firedAmmos[i].initialX + (firedAmmos[i].finalX - firedAmmos[i].initialX) * (firedAmmos[i].timePassed / firedAmmos[i].timeToFinal));
      firedAmmos[i].y = parseInt(firedAmmos[i].initialY + (firedAmmos[i].finalY - firedAmmos[i].initialY) * (firedAmmos[i].timePassed / firedAmmos[i].timeToFinal));
      let toColumn = Math.floor(firedAmmos[i].x / constants.cellSize);
      let toRow = Math.floor(firedAmmos[i].y / constants.cellSize);

      if (Math.floor(firedAmmos[i].x / constants.cellSize) < 0 || Math.floor(firedAmmos[i].x / constants.cellSize) >= constants.mapHeight ||
        Math.floor(firedAmmos[i].y / constants.cellSize) < 0 || Math.floor(firedAmmos[i].y / constants.cellSize) >= constants.mapWidth){
        data.firedAmmos[i].active = false;
        return;
      }

      if (fromColumn != toColumn || fromRow !== toRow) {
        if (!data.getMap()[toColumn][toRow].movable) {
          data.firedAmmos[i].active = false;
          return;
        }
      }

      if (firedAmmos[i].timePassed > firedAmmos[i].maxTime) {
        firedAmmos[i].active = false;
        return;
      }

      for (let key in data.characters) {
        if (data.characters[key].isOnline && data.characters[key].isAlive && key != data.firedAmmos[i].characterId) {
          let isHit = collision.isCollision(data.firedAmmos[i].x, data.firedAmmos[i].y, 3, 3, data.characters[key].left - 32, data.characters[key].top - constants.cellSize, 32, constants.cellSize);//shoot from center
          if (isHit) {
            characterHit(data, key, firedAmmos[i].damage, firedAmmos[i].characterId);
            data.firedAmmos[i].active = false;
            break;
          }
        }

      }
      for (let key in data.animals) {
        if (data.firedAmmos[i].active && data.animals[key].isAlive) {
          let isHit = collision.isCollision(data.firedAmmos[i].x, data.firedAmmos[i].y, 3, 3, data.animals[key].location.left, data.animals[key].location.top, 40, 40);
          if (isHit) {
            animalHit (data, key, firedAmmos[i].damage, firedAmmos[i].characterId);
            data.firedAmmos[i].active = false;
            break;
          }

        }
      }
    }
  }
}
function characterHit (data, characterId, damage, attackerId){
  data.characters[characterId].health -= damage;
  sender.sendByViewDistance(data.characters, new Request({
    type: MSG_TYPES.HIT,
    request: new Array(0, data.characters[characterId].id, damage)
  }), data.characters[characterId].column, data.characters[characterId].row);
  if (data.characters[characterId].health <= 0) {
    let size = data.inventories[data.characters[characterId].inventoryId].size + data.inventories[data.characters[characterId].hotBarId].size;
    let inventoryId = data.createInventory(size);
    data.inventories[inventoryId].addAllFromInventory(data.inventories[data.characters[characterId].inventoryId], data.stacks);
    data.inventories[inventoryId].addAllFromInventory(data.inventories[data.characters[characterId].hotBarId], data.stacks);
    let mapLoot = new MapLoot(data.getId('mapItem'), new Location(data.characters[characterId].column, data.characters[characterId].row, data.characters[characterId].left - 32, data.characters[characterId].top - 64), inventoryId);
    data.mapLoots[mapLoot.mapItemId] = mapLoot;

    sender.sendByViewDistance(data.characters, new Request({
      type: MSG_TYPES.DIE,
      request: new Array(0, data.characters[characterId].id)
    }), data.characters[characterId].column, data.characters[characterId].row);
    sender.sendByViewDistance(data.characters, new Request({
      type: MSG_TYPES.MAP_LOOT,
      request: [new Array(mapLoot.mapItemId, mapLoot.inventoryId, mapLoot.location.left, mapLoot.location.top)]
    }), data.characters[characterId].column, data.characters[characterId].row);
    data.characters[characterId].dead(data.inventories, data.stacks);
  }
}
function animalHit(data, key, damage, attackerId){
  data.animals[key].health -= damage;
  sender.sendByViewDistance(data.characters, new Request({
    type: MSG_TYPES.HIT,
    request: new Array(1, data.animals[key].id, damage)
  }), data.animals[key].location.column, data.animals[key].location.row);
  if (data.animals[key].health <= 0) {
    let inventoryId = data.animals[key].getLoot(data);
    let mapLoot = new MapLoot(data.getId('mapItem'), new Location(data.animals[key].location.column, data.animals[key].location.row, data.animals[key].location.left, data.animals[key].location.top), inventoryId);
    data.mapLoots[mapLoot.mapItemId] = mapLoot;
    data.animals[key].dead();
    sender.sendByViewDistance(data.characters, new Request({
      type: MSG_TYPES.DIE,
      request: new Array(1, data.animals[key].id)
    }), data.animals[key].location.column, data.animals[key].location.row);
    sender.sendByViewDistance(data.characters, new Request({
      type: MSG_TYPES.MAP_LOOT,
      request: [new Array(mapLoot.mapItemId, mapLoot.inventoryId, mapLoot.location.left, mapLoot.location.top)]
    }), data.animals[key].location.column, data.animals[key].location.row);
    // sender.sendByViewDistance(data.characters, new Request({
    //   type: INVENTORY_DATA,
    //   request: data.inventories[inventoryId]
    // }), toColumn, toRow);
  }else{
    if (data.animals[key] instanceof (Coward))
      data.animals[key].fear(data.characters[attackerId].top, data.characters[attackerId].left);
    else if (data.animals[key] instanceof (Passive))
      data.animals[key].chase(data.characters[attackerId].top, data.characters[attackerId].left, attackerId);
    let result = new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].speed);
    let request = new Request({type: MSG_TYPES.NPC_MOVE, request: result});
    sender.sendByViewDistance(data.characters, request, data.animals[key].location.column, data.animals[key].location.row);
  }
}
module.exports = mainLoop;