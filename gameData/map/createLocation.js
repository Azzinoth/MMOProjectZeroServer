const gameBoardWidth = 48*3;
const gameBoardHeight = 48*3;
const Cell = require('./Cell')
function createLocation(height=gameBoardHeight, width=gameBoardWidth){
	let cellsMap = new Array(height);
	for (let i = 0; i<height; i++){
		cellsMap[i] = new Array(width);
		for (let j = 0; j<width; j++){
			cellsMap[i][j] = new Cell({movable : true, column : i, row : j});
			if (Math.random()<0.25){
				cellsMap[i][j].idObject = 1;
				cellsMap[i][j].movable = false;
			}else if (Math.random()>=0.25&&Math.random()<0.5){
				cellsMap[i][j].idObject = 2;
				cellsMap[i][j].movable = false;
			}
		}
	}
	return cellsMap;
}
module.exports = createLocation;