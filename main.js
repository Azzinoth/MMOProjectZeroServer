const server1 = require ('./network/server');
const initDb = require ('./sql/initDb');
initDb('./sql/tables/dataBase.db');
server1();