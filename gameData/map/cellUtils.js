function isBuilderCell(cellsMap, column, row){
    if (cellsMap[column][row].objectId===undefined||cellsMap[column][row].objectId===null){
        return true;
    }else{
        return false;
    }
}
function isMovableCell(cellsMap, fromRow, toRow, fromColumn, toColumn){
	if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2){
		return cellsMap[toColumn][toRow].movable;
	}else{
		return false;
	}
}
function isGatheredCell(cellsMap, fromRow, fromColumn, toRow, toColumn){
    if (Math.abs(fromRow-toRow)<2&&Math.abs(fromColumn-toColumn)<2&&cellsMap[toColumn][toRow].objectId!==null){
		cellsMap[toColumn][toRow].objectId=null;
		cellsMap[toColumn][toRow].movable = true;
		return true;
    }else{
        return false;
    }
}
exports.isBuilderCell = isBuilderCell;
exports.isMovableCell = isMovableCell;
exports.isGatheredCell = isGatheredCell;