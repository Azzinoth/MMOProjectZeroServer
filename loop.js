const Request = require('./network/Request');
const sender = require('./network/sender');
const collision = require('./utils/collision');
const getTime = require('./utils/getTime');
const visibleObjects = require('./gameData/visibleObjects');
const cellUtils = require('./gameData/map/cellUtils');
const initialize = require('./network/initialize');
const MapLoot = require('./gameData/mapItem/MapLoot');
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

function moveCharacters(data) {
  let request;
  for (let key in data.characters) {
    if (data.characters[key].isAlive && data.characters[key].isOnline && data.characters[key].direction !== -1) {
      let column = data.characters[key].column;
      let row = data.characters[key].row;
      let changedCell = data.characters[key].getNewCoord();
      let toColumn = Math.floor(changedCell[0] / 64);
      let toRow = Math.floor(changedCell[1] / 64);
      if (column !== toColumn || row !== toRow) {
        if (cellUtils.isMovableCell(data.getMap(), row, toRow, column, toColumn)) {
          let visible = visibleObjects.surroundObjects(data.characters[key].column, data.characters[key].row, data.characters[key].viewDistance, 48 * 3, 48 * 3, data.getMap());
          let result = [];
          for (let i = 0; i < visible.length; i++) {
            result.push(new Array(visible[i].column, visible[i].row, visible[i].objectId));
          }
          request = new Request({type: MSG_TYPES.MAP_OBJECT, request: result});
          sender.sendToClient(data.characters[key].accountId, request);
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

          let surroundLoots = visibleObjects.surroundLoots(data.characters[key].column, data.characters[key].row, data.characters[key].viewDistance, data.mapLoots);
          for (let i = 0; i < surroundLoots.length; i++) {
            request = new Request({
              type: MSG_TYPES.MAP_LOOT,
              request: new Array(surroundLoots[i].mapItemId, surroundLoots[i].inventoryId, surroundLoots[i].left, surroundLoots[i].top)
            });
            sender.sendToClient(data.characters[key].accountId, request);
            request = new Request({type: MSG_TYPES.INVENTORY_DATA, request: data.inventories[surroundLoots[i].inventoryId]});
            sender.sendToClient(data.characters[key].accountId, request);
          }

        } else continue;
      }
      //data.characters[key].lastTick = getTime.getTimeInMs();
      data.characters[key].move(changedCell[0], changedCell[1], toColumn, toRow);

    }

  }
}

function moveNpc(data) {
  let result = [];
  for (let key in data.animals) {
    if (!data.animals[key].isAlive) {
      data.animals[key].timeToResurrection--;
      if (data.animals[key].timeToResurrection <= 0) {
        data.animals[key].resurrect(data.zones);
      }
      continue;
    }
    //result.push(new Array(data.animals[key].location.left, data.animals[key].location.top));
    if (data.animals[key].zoneId === null) {
      data.animals[key].randZone();
    }
    if (data.animals[key].destination === null) {
      data.animals[key].chooseNewDestination(data.getMap(), data.zones);
    }
    if (data.animals[key].destination !== null && data.animals[key].path.length === 0) {
      data.animals[key].findPath(data.getMap());
      if (data.animals[key].findPath.length > 0) {
        result = new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row);
        sender.sendByViewDistance(data.characters, new Request({
          type: MSG_TYPES.NPC_MOVE,
          request: result
        }), data.animals[key].location.column, data.animals[key].location.row);
      }
    }
    if (data.animals[key].path.length > 0 && !data.animals[key].isMovement) {
      data.animals[key].initMovement();

    }
    let fromColumn = data.animals[key].location.column;
    let fromRow = data.animals[key].location.row;
    let changeCell = data.animals[key].move();
    if (changeCell === 1) {
      for (let key2 in data.characters) {
        if (data.characters[key2].isOnline) {
          let isNewVisible = visibleObjects.isNewObjectInViewDistance(data.characters[key2].left, data.characters[key2].top, fromColumn * 64, fromRow * 64, data.animals[key].location.left, data.animals[key].location.top, data.characters[key2].viewDistance);
          if (isNewVisible) {
            result.push(new Array(data.animals[key].id, data.animals[key].path, data.animals[key].location.column, data.animals[key].location.row, data.animals[key].location.left, data.animals[key].location.top));
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
      let fromColumn = Math.floor(firedAmmos[i].x / 64);
      let fromRow = Math.floor(firedAmmos[i].y / 64);
      firedAmmos[i].x = parseInt(firedAmmos[i].initialX + (firedAmmos[i].finalX - firedAmmos[i].initialX) * (firedAmmos[i].timePassed / firedAmmos[i].timeToFinal));
      firedAmmos[i].y = parseInt(firedAmmos[i].initialY + (firedAmmos[i].finalY - firedAmmos[i].initialY) * (firedAmmos[i].timePassed / firedAmmos[i].timeToFinal));
      let toColumn = Math.floor(firedAmmos[i].x / 64);
      let toRow = Math.floor(firedAmmos[i].y / 64);

      if (Math.floor(firedAmmos[i].x / 64) < 0 || Math.floor(firedAmmos[i].x / 64) >= 43*3 ||
        Math.floor(firedAmmos[i].y / 64) < 0 || Math.floor(firedAmmos[i].y / 64) >= 43*3){
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
          let isHit = collision.isCollision(data.firedAmmos[i].x, data.firedAmmos[i].y, 3, 3, data.characters[key].left - 32, data.characters[key].top - 64, 32, 64);//shoot from center
          if (isHit) {
            let damage = firedAmmos[i].damage;
            data.characters[key].health -= damage;
            sender.sendByViewDistance(data.characters, new Request({
              type: MSG_TYPES.HIT,
              request: new Array(0, data.characters[key].id, damage)
            }), firedAmmos[i].x / 64, firedAmmos[i].y / 64);
            if (data.characters[key].health <= 0) {
              let size = data.inventories[data.characters[key].inventoryId].size + data.inventories[data.characters[key].hotBarId].size;
              let inventoryId = data.createInventory(size);
              data.inventories[inventoryId].addAllFromInventory(data.inventories[data.characters[key].inventoryId]);
              data.inventories[inventoryId].addAllFromInventory(data.inventories[data.characters[key].hotBarId]);
              let mapLoot = new MapLoot(data.getId('mapItem'), data.characters[key].left - 32, data.characters[key].top - 64, inventoryId);
              data.mapLoots[mapLoot.mapItemId] = mapLoot;
              data.characters[key].dead(data.inventories, data.stacks);
              sender.sendByViewDistance(data.characters, new Request({type: MSG_TYPES.DIE, request: new Array(0, data.characters[key].id)}));
              sender.sendByViewDistance(data.characters, new Request({
                type: MSG_TYPES.MAP_LOOT,
                request: new Array(mapLoot.mapItemId, mapLoot.inventoryId, mapLoot.left, mapLoot.top)
              }), toColumn, toRow);
              // sender.sendByViewDistance(data.characters, new Request({
              //   type: INVENTORY_DATA,
              //   request: data.inventories[inventoryId]
              // }), toColumn, toRow);
              initialize(data, data.characters[key].accountId);
            }
            data.firedAmmos[i].active = false;
            break;
          }
        }

      }
      for (let key in data.animals) {
        if (data.firedAmmos[i].active && data.animals[key].isAlive) {
          let isHit = collision.isCollision(data.firedAmmos[i].x, data.firedAmmos[i].y, 3, 3, data.animals[key].location.left, data.animals[key].location.top, 40, 40);
          if (isHit) {
            let damage = firedAmmos[i].damage;
            data.animals[key].health -= damage;
            data.firedAmmos[i].active = false;
            sender.sendByViewDistance(data.characters, new Request({
              type: MSG_TYPES.HIT,
              request: new Array(1, data.animals[key].id, damage)
            }), firedAmmos[i].x / 64, firedAmmos[i].y / 64);
            if (data.animals[key].health <= 0) {
              let inventoryId = data.animals[key].getLoot(data);
              let mapLoot = new MapLoot(data.getId('mapItem'), data.animals[key].location.left, data.animals[key].location.top, inventoryId);
              data.mapLoots[mapLoot.mapItemId] = mapLoot;
              data.animals[key].dead();
              data.firedAmmos[i].active = false;
              sender.sendByViewDistance(data.characters, new Request({
                type: MSG_TYPES.DIE,
                request: new Array(1, data.animals[key].id)
              }), toColumn, toRow);
              sender.sendByViewDistance(data.characters, new Request({
                type: MSG_TYPES.MAP_LOOT,
                request: new Array(mapLoot.mapItemId, mapLoot.inventoryId, mapLoot.left, mapLoot.top)
              }), toColumn, toRow);
              // sender.sendByViewDistance(data.characters, new Request({
              //   type: INVENTORY_DATA,
              //   request: data.inventories[inventoryId]
              // }), toColumn, toRow);
            }
            break;
          }

        }
      }
    }
  }
}

module.exports = mainLoop;