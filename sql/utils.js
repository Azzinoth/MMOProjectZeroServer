let id=null;

function getId(whatId){
	switch (whatId){
		case 'character':{
			return ++id;
		}
		break;
		case 'inventory':{
			return ++id;
		}
		break;
		case 'inventory':{
			return ++id;
		}
		break;
		default:{
			return ++id;
		}
	}		
}

function createTable(db, tableName, tableArguments){
    db.serialize(function(){
        db.run("CREATE TABLE "+tableName+" ("+tableArguments+");");
    });
}

function insert(db, tableName, tableArguments){
    db.serialize(function(){
        db.run("INSERT INTO "+tableName+" VALUES"+" ("+tableArguments+");");
    });
}
function closeDb(db){
    db.close();
}
exports.getId = getId;