exports.isMovableCell = (fieldMatrix, fromRow, toRow, fromColumn, toColumn) => {
  return Math.abs(fromRow - toRow) < 2 && Math.abs(fromColumn - toColumn) < 2
    ? fieldMatrix[toColumn][toRow].movable
    : false;
};

exports.isGatheredCell = (fieldMatrix, fromRow, fromColumn, toRow, toColumn, id) => {
  return Math.abs(fromRow - toRow) < 2 &&
         Math.abs(fromColumn - toColumn) < 2 &&
         fieldMatrix[toColumn][toRow].id === id
    ? fieldMatrix[toColumn][toRow].id = null
    : false;
};
