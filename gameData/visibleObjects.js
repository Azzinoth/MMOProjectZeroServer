const Request = require('../network/Request');
const sender = require('../network/sender');
const distanceUtils = require('../utils/distanceUtils');
const {
    HUMAN_MOVE
} = require('../constants').messageTypes;

function findCharacters(characters, distance, id) {
    let result = [];
    let character = characters[id];
    for (let key in characters){
        if (characters[key].isOnline&&key!=id&&(Math.abs(character.column-characters[key].column)<distance&&Math.abs(character.row-characters[key].row)<distance)){
            result.push(characters[key]);
        }
    }
    return result;
}

function surroundObjects (startColumn, startRow, distance, width, height, cellsMap){
    let arrayObjects = [];
    for (let i =startColumn-Math.floor(distance); i<=startColumn+Math.floor(distance); i++){
        for (let j =startRow-Math.floor(distance); j<=startRow+Math.floor(distance); j++){

            if (i<width&&j<height&&i>=0&&j>=0&&cellsMap[i][j].objectId!=null){
                arrayObjects.push(cellsMap[i][j]);
            }
        }
    }
    return arrayObjects;
}
function surroundAnimals (startColumn, startRow, distance, animals){
    let arrayObjects = [];
    for (let key in animals){
        if (animals[key].isAlive&&Math.abs(startColumn-animals[key].location.column)<distance&&(Math.abs(startRow-animals[key].location.row)<distance)){
            arrayObjects.push(new Array(animals[key].id, animals[key].path, animals[key].location.column, animals[key].location.row, animals[key].location.left, animals[key].location.top));
        }
    }
    return arrayObjects;
}

function surroundLoots (startColumn, startRow, distance, mapLoots){
  let arrayObjects = [];
  for (let key in mapLoots){
    if (Math.abs(startColumn-mapLoots[key].column)<distance&&(Math.abs(startRow-mapLoots[key].row)<distance)){
      arrayObjects.push(mapLoots[key]);
    }
  }
  return arrayObjects;
}

function isNewObjectInViewDistance(myLeft, myTop, fromLeft, fromTop, toLeft, toTop, viewDistance){
    let from = distanceUtils.distance(myLeft, myTop, fromLeft, fromTop);
    let to = distanceUtils.distance(myLeft, myTop, toLeft, toTop);
    let first =from<viewDistance*64;
    let second = to<viewDistance*64;
    if (!first&&second)return true;
    return false;
}
exports.surroundObjects = surroundObjects;
exports.findCharacters = findCharacters;
exports.surroundAnimals = surroundAnimals;
exports.isNewObjectInViewDistance = isNewObjectInViewDistance;
exports.surroundLoots = surroundLoots;