let db;
let sqlite3 = require('sqlite3').verbose();
const dataName = './sql/tables/dataBase.db';
let sqlQuery = new Array(2000);
function fill(){
    for (let i =0; i<sqlQuery.length; i++){
        sqlQuery[i]=new sqlObject();
    }
}
function initDB(){
    return new Promise(function(resolve, reject) {
        if (db==null) {
            db = new sqlite3.Database(dataName, (err) => {
                if (err) {
                    console.log('Error in sqlite3.Database' + err.message);
                }
                resolve('result');
            });
        }else{
            console.log('Error DB not close');
        }

    });

}
function pushDb(callback=null){
    return new Promise(function(resolve, reject) {
        db = new sqlite3.Database(dataName, (err) => {
            if (err) {
                resolve();
                console.log('Error in sqlite3.Database' + err.message);
            }
        });
        //db.serialize(function () {
            for (let i = 0; i < sqlQuery.length; i++) {
                if (sqlQuery[i].active ===false) break;
                else if (sqlQuery[i].sqlParam==="run"){
                    sqlQuery[i].active = false;
                    db.run(sqlQuery[i].query, function (err) {
                        if (err) {
                            resolve();
                            return console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
                        }
                        console.log('Run table ' + sqlQuery[i].tableName);
                    });

                }else if (sqlQuery[i].sqlParam==="all"){
                    sqlQuery[i].active = false;
                    db.all(sqlQuery[i].query, function (err, rows) {
                        if (err) {
                            resolve();
                            return console.log('Error  ' + sqlQuery[i].tableName + ': ' + err.message);
                        }
                        if (callback!==null){
                            callback(rows,sqlQuery[i].tableName)
                        }
                        console.log('Select table ' + sqlQuery[i].tableName + " "+rows.length);
                    });
                }
            }
            db.close();
            resolve();
        });
    //});
}
function closeDB(){
    return new Promise(function(resolve, reject) {
        db.close();
        db=null;
        resolve();
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

    // return new Promise(function(resolve, reject) {
    //     db.serialize(function () {
    //         db.run("CREATE TABLE " + tableName + " (" + tableArguments + ");", function (err) {
    //             if (err) {
    //                 return console.log('Error in create table ' + tableName + ': ' + err.message);
    //             }
    //             console.log('Table ' + tableName + ' created');
    //             if (callBack !== undefined) {
    //                 callBack();
    //             }
    //             resolve();
    //         });
    //     });
    //
    // });
}

function insert(tableName, tableArguments, value, callBack){
    addSql("run",tableName,"INSERT INTO " + tableName + " (" + tableArguments + ") VALUES" + " (" + value + ");");
    // return new Promise(function(resolve, reject) {
    //     db.serialize(function () {
    //         db.run("INSERT INTO " + tableName + " (" + tableArguments + ") VALUES" + " (" + value + ");", function (err) {
    //             if (err){
    //                 return console.log('Error in insert into '+tableName+': '+err.message);
    //             }
    //             console.log('Row inserted in '+tableName+' with id '+this.lastID);
    //             //let id = this.lastID;
    //             if (callBack !== undefined) {
    //                 callBack();
    //             }
    //             resolve();
    //         });
    //     });
    //
    // });
}

function insertAll(tableName, array, callBack){

    // return new Promise(function(resolve, reject) {
        if (array===null){
            // resolve();
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
                    let health = array[key].health;
                    let strength = array[key].strength;
                    if (values===null){
                        values = '('+id+', '+inventoryId+', '+isPlayer+', '+column+', '+row+', '+top+', '+left+', '+health+', '+strength+')';
                    }else  values += ', ('+key+', '+inventoryId+', '+isPlayer+', '+column+', '+row+', '+top+', '+left+', '+health+', '+strength+')';
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
            // db.run('INSERT INTO ' + tableName + ' VALUES'+values);
            // console.log('Inserted all ' + tableName);
        }
        values = null;

        // resolve();
    // });
}

function selectAll(tableName, callBack){
    addSql("all",tableName,"SELECT * FROM " + tableName);
    // return new Promise(function(resolve, reject) {
    //     db.serialize(function () {
    //         db.all("SELECT * FROM " + tableName, function (err, rows) {
    //             if (err) {
    //                 resolve();
    //                 console.log('Error in select all '+tableName+': '+err.message);
    //                 return;
    //             }
    //             if (callBack !== undefined) {
    //                 callBack(rows, tableName);
    //
    //             }
    //             console.log('Get all data from '+tableName +': '+rows.length);
    //             resolve();
    //         });
    //     });
    //
    // });
}

function drop(tableName){
    addSql("run",tableName,"DROP TABLE " + tableName);
    // return new Promise(function(resolve, reject) {
    //     db.serialize(function () {
    //         db.run("DROP TABLE " + tableName);
    //         console.log('Droped table ' + tableName);
    //         resolve();
    //     });
    // });
}
function deleteTable(tableName, callBack){
    addSql("run",tableName,"DELETE FROM " + tableName);
    // return new Promise(function(resolve, reject) {
    //     db.serialize(function () {
    //         db.run("DELETE FROM " + tableName, function (err) {
    //             if (err) {
    //                 resolve();
    //                 return console.log('Error in delete table ' + tableName + ': ' + err.message);
    //             }
    //             //console.log('Delete from table ' + tableName);
    //             if (callBack !== undefined) {
    //                 callBack();
    //             }
    //             resolve();
    //         });
    //     });
    // });
}
function deleteAllById(tableName, arrayId, callBack){

    // return new Promise(function(resolve, reject) {
        if (arrayId.length<=0){
            // resolve();
            return;
        }
        // db.serialize(function () {
            let sqlId = null;
            for(let i=0; i<arrayId.length; i++){
                if (sqlId===null){
                    sqlId = 'id='+arrayId[i];
                } else{
                    sqlId += ' OR id='+arrayId[i];
                }
            }
            addSql("run",tableName,"DELETE FROM " + tableName+' WHERE '+sqlId);
            // db.run("DELETE FROM " + tableName+' WHERE '+sqlId, function (err) {
            //     if (err) {
            //         resolve();
            //         return console.log('Error in delete table ' + tableName + ': ' + err.message);
            //     }
            //     console.log('Delete from table ' + tableName+' by id '+arrayId);
            //     if (callBack !== undefined) {
            //         callBack();
            //     }
            // });
        // });
        // resolve();
    // });
}
function deleteById(tableName, id, callBack){
    addSql("run",tableName,"DELETE FROM " + tableName+' WHERE id='+id);
    // return new Promise(function(resolve, reject) {
    //     db.serialize(function () {
    //         db.run("DELETE FROM " + tableName+' WHERE id='+id, function (err) {
    //             if (err) {
    //                 resolve();
    //                 return console.log('Error in delete table ' + tableName + ': ' + err.message);
    //             }
    //             console.log('Delete from table ' + tableName+' by id '+id);
    //             if (callBack !== undefined) {
    //                 callBack();
    //             }
    //             resolve();
    //         });
    //     });
    //
    // });
}
function updateById(tableName, id, value, callBack){

    // return new Promise(function(resolve, reject) {
        let sqlValue;
        switch (tableName){
            case 'mapCells':{
                sqlValue = 'column='+value.column+' row='+value.row+' movable='+value.movable===true?1:0+' objectId='+value.objectId;
                addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue+' WHERE column='+value.column+'AND row='+value.row);
                // db.serialize(function () {
                //     db.run("UPDATE " + tableName+' SET '+sqlValue+' WHERE column='+value.column+'AND row='+value.row, function (err) {
                //         if (err) {
                //             // resolve();
                //             return console.log('Error in delete table ' + tableName + ': ' + err.message);
                //         }
                //         console.log('Update table ' + tableName+' by id '+id);
                //         if (callBack !== undefined) {
                //             callBack();
                //         }
                //         // resolve();
                //     });
                // });
            }
            case 'identificators':{
                if (value===null){
                    // resolve();
                    return;
                }
                sqlValue = 'characterId='+value.characterId+', itemId='+value.itemId+', mapItemId='+value.mapItemId+', recipeId='+value.recipeId+', inventoryId='+value.inventoryId+', stackId='+value.stackId
                addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue);
                // db.serialize(function () {
                //     db.run("UPDATE " + tableName+' SET '+sqlValue, function (err) {
                //         if (err) {
                //             // resolve();
                //             return console.log('Error in update table ' + tableName + ': ' + err.message);
                //         }
                //         console.log('Update table ' + tableName);
                //         if (callBack !== undefined) {
                //             callBack();
                //         }
                //         resolve();
                //     });
                // });
            }
        }

    // });
}
function updateAllById(tableName, array, callBack){
    // return new Promise(function(resolve, reject) {
        let sqlValue;
        switch (tableName){
            case 'mapCells':
                for (let i = 0; i<array.length; i++){
                    sqlValue = 'column='+array[i].column+' row='+array[i].row+' movable='+array[i].movable===true?1:0+' objectId='+array[i].objectId;
                    addSql("run",tableName,"UPDATE " + tableName+' SET '+sqlValue+' WHERE column='+array[i].column+'AND row='+array[i].row);
                    // db.serialize(function () {
                    //     db.run("UPDATE " + tableName+' SET '+sqlValue+' WHERE column='+array[i].column+'AND row='+array[i].row, function (err) {
                    //         if (err) {
                    //             resolve();
                    //             return console.log('Error in delete table ' + tableName + ': ' + err.message);
                    //         }
                    //         console.log('Update table ' + tableName+' by id '+id);
                    //         if (callBack !== undefined) {
                    //             callBack();
                    //             resolve();
                    //         }
                    //     });
                    // });
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
    // });
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
exports.initDB = initDB;
exports.closeDB = closeDB;
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