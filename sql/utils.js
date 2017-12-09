let db;
let sqlite3 = require('sqlite3').verbose();
const dataName = './sql/tables/dataBase.db';
let sqlQuery = new Array(2000);
function fill(){
    for (let i =0; i<sqlQuery.length; i++){
        sqlQuery[i]=new sqlObject();
    }
}

function pushDb(callback=null){
    return new Promise(function(resolve, reject) {
        let i=0;
        let length = sqlQuery.length;
        db = new sqlite3.Database(dataName, (err) => {
            if (err) {
                console.log('Error in sqlite3.Database' + err.message);
                db.close();
                resolve();
                return;
            }
            follow(i);
        });


        function follow(i) {
            if (i===length||sqlQuery[i].active===false){
                db.close();
                resolve();
                return;
            }
            if (sqlQuery[i].sqlParam==="run") {
                db.serialize(function () {
                    db.run(sqlQuery[i].query, function (err) {
                        if (err) {
                            console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
                            db.close();
                            resolve();
                            return;
                        }
                        console.log('Run table ' + sqlQuery[i].tableName);
                        sqlQuery[i].active = false;
                        i++;
                        follow(i);

                    });

                });
            }else{
                db.all(sqlQuery[i].query, function (err, rows) {
                    if (err) {
                        console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
                        db.close();
                        resolve();
                        return;
                    }
                    if (callback!==null){
                        callback(rows,sqlQuery[i].tableName)
                    }
                    console.log('Select table ' + sqlQuery[i].tableName + " "+rows.length);
                    sqlQuery[i].active = false;
                    i++;
                    follow(i);

                });
            }
        }
    });
}

function addSql(type, tableName, sql){
    for (let i =0; i<sqlQuery.length; i++){
        if (sqlQuery[i].active===false){
            sqlQuery[i].tableName = tableName;
            sqlQuery[i].query = sql;
            sqlQuery[i].sqlParam = type;
            sqlQuery[i].active = true;
            break;
        }
        if (i===sqlQuery.length-1)sqlQuery.push(new sqlObject(sql, tableName, type, true));
    }
}
function createTable(tableName, tableArguments, callBack){
    addSql("run",tableName,"CREATE TABLE " + tableName + " (" + tableArguments + ");");
}

function insert(tableName, tableArguments, value, callBack){
    addSql("run",tableName,"INSERT INTO " + tableName + " (" + tableArguments + ") VALUES" + " (" + value + ");");
}

function insertAll(tableName, array, callBack){

    // return new Promise(function(resolve, reject) {
        if (array===null){
            return;
        }
        let values =null;
        switch(tableName){
            case 'characters':{
                for (let key in array){
                    let id = key;
                    let inventoryId = array[key].inventoryId;
                    let isPlayer;
                    if (array[key].isPlayer){
                        isPlayer = 1;
                    }else isPlayer = 0;
                    let column = array[key].column;
                    let row = array[key].row;
                    let top = array[key].top;
                    let left = array[key].left;
                    let level = array[key].level;
                    let health = array[key].health;
                    let strength = array[key].strength;
                    let armId = array[key].armId;
                    let bodyId = array[key].bodyId;
                    let headId = array[key].headId;
                    if (values===null){
                        values = '('+id+', '+inventoryId+', '+isPlayer+', '+column+', '+row+', '+top+', '+left+', '+level+', '+health+', '+strength+', '+armId+', '+bodyId+', '+headId+')';
                    }else  values += ', ('+key+', '+inventoryId+', '+isPlayer+', '+column+', '+row+', '+top+', '+left+', '+level+', '+health+', '+strength+', '+armId+', '+bodyId+', '+headId+')';
                }
            }
                break;
            case 'inventories':
                for (let key in array){
                    let id = key;
                    let size = array[key].size;
                    if (values===null){
                        values = '('+id+', '+size+')';
                    }else  values += ', ('+id+', '+size+')';
                }

                    break;
            case 'characterRecipes':
                for (let key in array){
                    let characterId = key;
                    let recipeId = array[key].recipeId;
                    if (values===null){
                        values = '('+characterId+', '+recipeId+')';
                    }else  values += ', ('+characterId+', '+recipeId+')';
                }

                break;
            case 'stacks':
                for (let key in array){
                    let id = key;
                    let itemId = array[key].itemId;
                    let size = array[key].size;
                    let inventoryId = array[key].inventoryId;
                    if (values===null){
                        values = '('+id+', '+itemId+', '+size+', '+inventoryId+')';
                    }else  values += ', ('+id+', '+itemId+', '+size+', '+inventoryId+')';
                }

                break;
            case 'items':

                break;
            case 'mapItems':

                break;
            case 'mapCells':{
                for (let i = 0; i < array.length; i++) {
                    let col = array[i].column;
                    let row = array[i].row;
                    let movable = array[i].movable === true ? 1 : 0;
                    let objId = array[i].objectId;
                    if (values===null){
                    values = '('+col+', '+row+', '+movable+', '+objId+')';
                    }else  values += ', ('+col+', '+row+', '+movable+', '+objId+')';
                }

            }
                break;
            case 'recipeList':

                break;
        }
        if (values!==null) {
            addSql("run",tableName,'INSERT INTO ' + tableName + ' VALUES'+values);
        }
        values = null;
}

function selectAll(tableName, callBack){
    addSql("all",tableName,"SELECT * FROM " + tableName);
}

function drop(tableName){
    addSql("run",tableName,"DROP TABLE " + tableName);
}
function deleteTable(tableName, callBack){
    addSql("run",tableName,"DELETE FROM " + tableName);
}
function deleteAllById(tableName, arrayId, callBack){

        if (arrayId.length<=0){
            return;
        }
            let sqlId = null;
            for(let i=0; i<arrayId.length; i++){
                if (sqlId===null){
                    sqlId = 'id='+arrayId[i];
                } else{
                    sqlId += ' OR id='+arrayId[i];
                }
            }
            addSql("run",tableName,"DELETE FROM " + tableName+' WHERE '+sqlId);
}
function deleteById(tableName, id, callBack){
    addSql("run",tableName,"DELETE FROM " + tableName+' WHERE id='+id);
}
function updateById(tableName, id, value, callBack){
        let sqlValue;
        switch (tableName){
            case 'mapCells':{
                sqlValue = 'column='+value.column+' row='+value.row+' movable='+value.movable===true?1:0+' objectId='+value.objectId;
                addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue+' WHERE column='+value.column+'AND row='+value.row);
            }
            case 'identificators':{
                if (value===null){
                    return;
                }
                sqlValue = 'characterId='+value.characterId+', itemId='+value.itemId+', mapItemId='+value.mapItemId+', recipeId='+value.recipeId+', inventoryId='+value.inventoryId+', stackId='+value.stackId
                addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue);
            }
        }
}
function updateAllById(tableName, array, callBack){
        let sqlValue;
        switch (tableName){
            case 'mapCells':
                for (let i = 0; i<array.length; i++){
                    sqlValue = 'column='+array[i].column+' row='+array[i].row+' movable='+array[i].movable===true?1:0+' objectId='+array[i].objectId;
                    addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue+' WHERE column='+array[i].column+'AND row='+array[i].row);
                }
                break;
            case 'characters':

                break;
            case 'inventories':

                break;
            case 'stacks':

                break;
            case 'characterRecipes':

                break;
        }
}
function sqlObject(query=null, tableName=null, sqlParam=null, active=false){
    this.query=query;
    this.tableName=tableName;
    this.sqlParam = sqlParam;
    this.active = active;
}
let sqlObjectProto ={
    query:null,
    tableName: null,
    sqlParam : null,
    active : false
}
exports.createTable = createTable;
exports.insert = insert;
exports.insertAll = insertAll;
exports.drop = drop;
exports.selectAll = selectAll;
exports.deleteTable =deleteTable;
exports.deleteById =deleteById;
exports.deleteAllById =deleteAllById;
exports.updateAllById=updateAllById;
exports.pushDb = pushDb;
exports.fill = fill;
exports.updateById=updateById;