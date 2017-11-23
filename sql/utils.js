let db;
let sqlite3 = require('sqlite3').verbose();
const dataName = './sql/tables/dataBase.db';
function createTable(tableName, tableArguments, callBack=undefined){
	db = new sqlite3.Database(dataName);
    db.serialize(function(){
        db.run("CREATE TABLE "+tableName+" ("+tableArguments+");", function(){			
			if (callBack!==undefined){
				callBack();
			}
		});
    });
	db.close();
}

function insert(tableName, tableArguments, value){
	db = new sqlite3.Database(dataName);
    db.serialize(function(){
        let result = db.run("INSERT INTO "+tableName+" ("+tableArguments+") VALUES"+" ("+value+");");		
    });
	db.close();
}

function selectAll(tableName, callBack){
	db = new sqlite3.Database(dataName);
	db.serialize(function(){
	    db.all("SELECT * FROM "+tableName, function(err, row){
		   if (err!==null){
			   console.log(err);
			   return;
		   }
		callBack(row, tableName);
	   });
	});
	db.close();
}
function getId(tableName, tableArguments){
	
	db = new sqlite3.Database(dataName);
	let id = db.lastInsertRowId;
    //db.serialize(function(){
     //  let id = db.run("SELECT id FROM "+tableName);
    //});
	db.close();
}
function drop(tableName){
	db = new sqlite3.Database(dataName);
    db.serialize(function(){
        db.run("DROP TABLE "+tableName);
    });
	db.close();
}
exports.getId = getId;
exports.createTable = createTable;
exports.insert = insert;
exports.drop = drop;
exports.selectAll = selectAll;