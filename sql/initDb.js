function initDb(name){
    let sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database(name);
}
module.exports = initDb;