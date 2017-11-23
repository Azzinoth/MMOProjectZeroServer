const server = require ('./network/server');
const data = require ('./gameData/data');
const sqlUtils = require ('./sql/utils');
/* sqlUtils.drop('stacks');
sqlUtils.drop('inventories');
sqlUtils.drop('ingredients');
sqlUtils.drop('craftRecipes');
sqlUtils.drop('characterRecipes');
sqlUtils.drop('characters');*/
sqlUtils.drop('items');
sqlUtils.createTable('items', 'id INTEGER primary key autoincrement, name TEXT, type TEXT, stackSize INTEGER', function(){
	sqlUtils.insert('items', 'name, type, stackSize', '\'wood\', \'resource\', 20');
	sqlUtils.insert('items', 'name, type, stackSize', '\'stone\', \'resource\', 20');
	sqlUtils.insert('items', 'name, type, stackSize', '\'woodWall\', \'buildingPart\', 20');
	sqlUtils.insert('items', 'name, type, stackSize', '\'stoneWall\', \'buildingPart\', 20');
});  


//sqlUtils.createTable('mapItems', 'id INTEGER primary key autoincrement, type TEXT, size INTEGER');
//sqlUtils.insert('mapItems', 'type, size', '\'rock\', 5');
//sqlUtils.insert('mapItems', 'type, size', '\'tree\', 5');

//sqlUtils.createTable('mapCells', 'column INTEGER, row INTEGER, movable INTEGER, objectId');
//for (let i =0; i<48; i++){
//	for (let j =0; j<48; j++){
//		if (Math.random()<0.25){
//			sqlUtils.insert('mapCells', 'column, row, movable, objectId', i+', '+j+', 0, 1');
//		}else if (Math.random()>=0.25&&Math.random()<0.5){
//			sqlUtils.insert('mapCells', 'column, row, movable, objectId', i+', '+j+', 0, 2');
//		}else{
//			sqlUtils.insert('mapCells', 'column, row, movable, objectId', i+', '+j+', 1, null');
//		}
//	}
//}

sqlUtils.createTable('stacks', 'id INTEGER primary key autoincrement, itemId INTEGER, size INTEGER');
sqlUtils.createTable('inventories', 'id INTEGER primary key autoincrement, size INTEGER, stackId INTEGER');

sqlUtils.createTable('ingredients', 'itemId INTEGER, amount INTEGER, recipeId INTEGER', function(){
	console.log('Done!');
	sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 4, 1');
	sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '2, 3, 2');
	sqlUtils.insert('ingredients', 'itemId, amount, recipeId', '1, 3, 2');
});


sqlUtils.createTable('craftRecipes', 'id INTEGER primary key autoincrement, craftedItemId INTEGER, name TEXT, outputAmount INTEGER, categoryName TEXT', function(){
	sqlUtils.insert('craftRecipes', 'craftedItemId, name, outputAmount, categoryName', '3, \'Wood wall\', 1, \'Building\'');
	sqlUtils.insert('craftRecipes', 'craftedItemId, name, outputAmount, categoryName', '4, \'Stone wall\', 1, \'Building\'');
});

/* sqlUtils.selectAll('items', function(data, items){
	console.log(data);
}); */

sqlUtils.createTable('characterRecipes', 'characterId INTEGER, recipeId INTEGER');
sqlUtils.createTable('characters', 'id INTEGER primary key autoincrement, idInventory INTEGER, isPlayer INTEGER, column INTEGER, row INTEGER, top INTEGER, left INTEGER, health INTEGER, strength INTEGER');

//data.fillData(sqlUtils);
//server(data);