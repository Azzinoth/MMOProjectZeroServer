let db;
let sqlite3 = require('sqlite3').verbose();
const dataName = './sql/tables/dataBase.db';

function initDB(){
    db = new sqlite3.Database(dataName, (err) => {
        if (err){
            console.log('Error in sqlite3.Database'+err.message);
        }
    });
}
function closeDB(){
    db.close();
}
function createTable(tableName, tableArguments, callBack){

    db.serialize(function(){
        db.run("CREATE TABLE "+tableName+" ("+tableArguments+");", function(err){
            if (err){
                return console.log('Error in create table '+tableName+': '+err.message);
            }
            console.log('Table '+tableName+' created');
			if (callBack!==undefined){
				callBack();
			}
		});
    });

}

function insert(tableName, tableArguments, value, callBack){
    return new Promise(function(resolve, reject) {
        db.serialize(function () {
            db.run("INSERT INTO " + tableName + " (" + tableArguments + ") VALUES" + " (" + value + ");", function (err) {
                if (err){
                    return console.log('Error in insert into '+tableName+': '+err.message);
                }
                console.log('Row inserted in '+tableName+' with id '+this.lastID);
                let id = this.lastID;
                if (callBack !== undefined) {
                    callBack(id);
                }
                resolve(id);
            });
        });
    });
}

function insertAll(tableName, array, callBack){

    return new Promise(function(resolve, reject) {
        let stmt = db.prepare('INSERT INTO ' + tableName + ' VALUES(?,?,?,?)');
        switch(dataName){
            case 'characters':{
                for (let key in characters){
                    let inventoryId = characters[key].inventoryId;
                    let isPlayer = characters[key].isPlayer;
                    let size = characters[key].size;
                    let column = characters[key].column;
                    let row = characters[key].row;
                    let top = characters[key].top;
                    let left = characters[key].left;
                    let health = characters[key].health;
                    let strength = characters[key].strength;
                    let isAlive = characters[key].isAlive;
                    let craftRecipesId = [];
                }
            }
                break;
            case 'inventories':
                inventories[value.id] = value;
                break;
            case 'stacks':
                stacks[value.id] = value;
                break;
            case 'items':
                items[value.id] = value;
                break;
            case 'mapItems':
                mapItems[value.id] = value;
                break;
            case 'cellsMap':
                for (let i = 0; i < array.length; i++) {
                    let col = array[i].column;
                    let row = array[i].row;
                    let movable = array[i].movable === true ? 1 : 0;
                    let objId = array[i].objectId;
                    stmt.run(col, row, movable, objId);
                }
                break;
            case 'recipeList':
                recipeList[value.id] = value;
                break;
        }

        stmt.finalize();
        console.log('Inserted ' + tableName);
    });
}

function selectAll(tableName, callBack){
	return new Promise(function(resolve, reject) {
        db.serialize(function () {
            db.all("SELECT * FROM " + tableName, function (err, rows) {
                if (err) {
                    console.log('Error in select all '+tableName+': '+err.message);
                    return;
                }
                if (callBack !== undefined) {
                    callBack(rows, tableName);

                }
                console.log('Get all data from '+tableName +': '+rows);
                resolve("result");
            });
        });
    });
}

function drop(tableName){
    db.serialize(function(){
        db.run("DROP TABLE "+tableName);
        console.log('Droped table '+tableName);
    });
}
function deleteTable(tableName, callBack){
    db.serialize(function(){
        db.run("DELETE FROM "+tableName, function(err){
            if (err){
                return console.log('Error in create table '+tableName+': '+err.message);
            }
            console.log('Delete from table '+tableName);
            if (callBack!==undefined){
                callBack();
            }
        });
    });
}

exports.initDB = initDB;
exports.closeDB = closeDB;
exports.createTable = createTable;
exports.insert = insert;
exports.insertAll = insertAll;
exports.drop = drop;
exports.selectAll = selectAll;
exports.deleteTable =deleteTable;