const { sendIfIdsNotEquals, sendToAll } = require('./utils').requestSender;
const Request = require('../utils').Request;
const Person = require('../entries').characters.Person;
const { messageHandler, closeHandler } = require('./events');
const { SESSION_ID, PERSON_DATA } = require('../constants').messageTypes;

module.exports = (webSocketServer, fieldMatrix) => {
  let clients = {};
  let characters = {};
  let id = null;

  webSocketServer.on('connection', function(ws) {
    id += 1;
    ws.id = id;
    clients[id] = ws;

    console.log(`new connection - ${id}`);

    clients[id].send(JSON.stringify(
      new Request({ type: SESSION_ID, request: id })
    ));
    characters[id] = new Person({ id: id });

    sendIfIdsNotEquals(clients, null, id, (client) => {
      client.send(JSON.stringify(
        new Request ({ type: PERSON_DATA, request: characters[id] })
      ))
    });

    sendToAll(characters, (character) => {
      character.send(JSON.stringify(
        new Request ({ type: PERSON_DATA, request: characters[key] })
      ));
    });

    ws.on('message', messageHandler(message, ws, clients, characters, fieldMatrix));
    ws.on('close', closeHandler());
  });
};