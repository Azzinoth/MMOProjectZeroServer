function isBuilderCell(cellsMap, column, row){
    if (cellsMap[column][row].objectId===undefined||cellsMap[column][row].objectId===null){
        return true;
    }else{
        return false;
    }
}
function isMovableCell(cellsMap, fromRow, toRow, fromColumn, toColumn){
  if (toRow<1||toColumn<1)return false;
	if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2){
		return cellsMap[toColumn][toRow].movable;
	}else{
		return false;
	}
}
function isGatheredCell(cellsMap, fromRow, fromColumn, toRow, toColumn, resources){
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