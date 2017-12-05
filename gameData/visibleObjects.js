const Request = require('../network/Request');
const sender = require('../network/sender');
const {
    HUMAN_MOVE
} = require('../constants').messageTypes;
function findCharacters(characters, distance, id) {
    let character = characters[id];
    for (let key in characters){
        if (key!=id&&(character.column+distance>characters[key].column/2&&character.column-distance<characters[key].column/2)&&
            (character.row+distance>characters[key].row/2&&character.row-distance<characters[key].row/2)){
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
exports.surroundObjects = surroundObjects;
exports.findCharacters = findCharacters;