const Request = require('../network/Request');
const sender = require('../network/sender');
const distanceUtils = require('../utils/distanceUtils');
const constans = require('../constants/constans');
const Lootable = require('./mapItem/buildingPart/Lootable');
const Production = require('./mapItem/buildingPart/lootable/Production');
const {
  HUMAN_MOVE
} = require('../constants').messageTypes;

function findCharacters(characters, distance, id) {
  let result = [];
  let character = characters[id];
  for (let key in characters) {
    if (characters[key].isOnline && characters[key].isAlive && key != id && (Math.abs(character.column - characters[key].column) < distance && Math.abs(character.row - characters[key].row) < distance)) {
      result.push(characters[key]);
    }
  }
  return result;
}

function surroundObjects(startColumn, startRow, distance, data) {
  let result = [];
  let resources = [];
  let buildingParts = [];
  let mapLoots = [];
  let mapItemId = null;
  let inventoryId = null;
  let isActive = null;
  for (let i = startColumn - Math.floor(distance); i <= startColumn + Math.floor(distance); i++) {
    for (let j = startRow - Math.floor(distance); j <= startRow + Math.floor(distance); j++) {
      if (i < constans.mapWidth && j < constans.mapHeight && i >= 0 && j >= 0 && data.getMap()[i][j].objectId != null) {
        mapItemId = data.getMap()[i][j].mapItemId;
        if (data.buildingParts.hasOwnProperty(mapItemId)) {
          if (data.buildingParts[mapItemId] instanceof (Lootable)) inventoryId = data.buildingParts[mapItemId].inventoryId;
          if (data.buildingParts[mapItemId] instanceof (Production)) isActive = data.buildingParts[mapItemId].isInAction;
          buildingParts.push(new Array(data.buildingParts[mapItemId].id, mapItemId, data.buildingParts[mapItemId].location.column, data.buildingParts[mapItemId].location.row, inventoryId, isActive, data.buildingParts[mapItemId].characterId));
        } else {
          resources.push(new Array(i, j, data.getMap()[i][j].objectId));
        }
      }
    }
  }
  for (let key in data.mapLoots){
    if (Math.abs(startColumn-data.mapLoots[key].location.column)<distance&&(Math.abs(startRow-data.mapLoots[key].location.row)<distance)){
      mapLoots.push(new Array(parseInt(key), data.mapLoots[key].inventoryId, data.mapLoots[key].location.left, data.mapLoots[key].location.top));
    }
  }
  result[0] = resources;
  result[1] = buildingParts;
  result[2] = mapLoots;
  return result;
}

function surroundAnimals(startColumn, startRow, distance, animals) {
  let arrayObjects = [];
  for (let key in animals) {
    if (animals[key].isAlive && Math.abs(startColumn - animals[key].location.column) <= distance && (Math.abs(startRow - animals[key].location.row) <= distance)) {
      arrayObjects.push(new Array(animals[key].id, animals[key].path, animals[key].location.column, animals[key].location.row, animals[key].location.left, animals[key].location.top));
    }
  }
  return arrayObjects;
}

function viewNewObjects(startColumn, startRow, toColumn, toRow, distance, animals) {
  let arrayObjects = [];
  for (let key in animals) {
    if (animals[key].isAlive && Math.abs(startColumn - animals[key].location.column) < distance && (Math.abs(startRow - animals[key].location.row) < distance)) {
      arrayObjects.push(new Array(animals[key].id, animals[key].path, animals[key].location.column, animals[key].location.row, animals[key].location.left, animals[key].location.top));
    }
  }
  return arrayObjects;
}


function isNewObjectInViewDistance(myLeft, myTop, fromLeft, fromTop, toLeft, toTop, viewDistance) {
  let from = distanceUtils.distance(myLeft, myTop, fromLeft, fromTop);
  let to = distanceUtils.distance(myLeft, myTop, toLeft, toTop);
  let first = from < viewDistance * 64;
  let second = to < viewDistance * 64;
  if (!first && second) return true;
  return false;
}

exports.surroundObjects = surroundObjects;
exports.findCharacters = findCharacters;
exports.surroundAnimals = surroundAnimals;
exports.isNewObjectInViewDistance = isNewObjectInViewDistance;
