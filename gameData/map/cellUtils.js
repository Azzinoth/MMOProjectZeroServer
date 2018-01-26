const constans = require('../../constants/constans');
const data = require ('../data');
const Door = require ('../mapItem/buildingPart/Door');
function isBuilderCell(cellsMap, column, row){
  if (row<1||column<1||row>constans.mapHeight-2||column>constans.mapWidth-2)return false;
    if (cellsMap[column][row].objectId===null){
        return true;
    }else{
        return false;
    }
}
function isMovableCell(cellsMap, fromRow, toRow, fromColumn, toColumn, npcId=null){
  if (toRow<1||toColumn<1||toRow>constans.mapHeight-2||toColumn>constans.mapWidth-2)return false;
	if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2){
	  if (cellsMap[toColumn][toRow].movable){
      return true;
    }else if (npcId!==null &&
        data.buildingParts[cellsMap[toColumn][toRow].mapItemId] instanceof (Door) &&
        data.buildingParts[cellsMap[toColumn][toRow].mapItemId].characterId === npcId){
        return true;
    }else return false;

	}else{

		return false;
	}
}
function isGatheredCell(cellsMap, fromRow, fromColumn, toRow, toColumn, resources){
    if (toRow<1||toColumn<1||toRow>constans.mapHeight-2||toColumn>constans.mapWidth-2)return false;
    let mapItemId = cellsMap[toColumn][toRow].mapItemId;
    if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2&&mapItemId!==null&&resources.hasOwnProperty(mapItemId)){
		return true;
    }else{
        return false;
    }
}
function isNearCell(fromColumn, fromRow, toColumn, toRow, distance){
  if (Math.abs(fromRow-toRow)<distance+1&&Math.abs(fromColumn-toColumn)<distance+1){
    return true;
  }else{
    return false;
  }
}
exports.isBuilderCell = isBuilderCell;
exports.isMovableCell = isMovableCell;
exports.isGatheredCell = isGatheredCell;
exports.isNearCell = isNearCell;