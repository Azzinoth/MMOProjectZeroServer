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
module.exports = surroundObjects;