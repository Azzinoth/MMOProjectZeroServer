const Request = require('../network/Request');
const sender = require('../network/sender');
const {
    HUMAN_MOVE
} = require('../constants').messageTypes;
function findCharacters(characters, distance, id) {
    let character = characters[id];
    for (let key in characters){
        if (key!=id&&(character.column+distance/2>characters[key].column&&character.column-distance/2<characters[key].column)&&
            (character.row+distance/2>characters[key].row&&character.row-distance/2<characters[key].row)){
            sender.sendToClient(id, new Request({type:HUMAN_MOVE, request:characters[key]}));
            sender.sendToClient(key, new Request({type:HUMAN_MOVE, request:characters[id]}));
        }
    }
}

function surroundObjects (startColumn, startRow, distance, width, height, cellsMap){
    let arrayObjects = [];
    for (let i =startColumn-Math.floor(distance/2); i<=startColumn+Math.floor(distance/2); i++){
        for (let j =startRow-Math.floor(distance/2); j<=startRow+Math.floor(distance/2); j++){

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
        if ((startColumn+distance/2>animals[key].location.column&&startColumn-distance/2<animals[key].location.column)&&
            (startRow+distance/2>animals[key].location.row&&startRow-distance/2<animals[key].location.row)){
            arrayObjects.push(new Array(animals[key].id, animals[key].path, animals[key].location.column, animals[key].location.row, animals[key].location.left, animals[key].location.top));
        }
    }
    return arrayObjects;
}
exports.surroundObjects = surroundObjects;
exports.findCharacters = findCharacters;
exports.surroundAnimals = surroundAnimals;