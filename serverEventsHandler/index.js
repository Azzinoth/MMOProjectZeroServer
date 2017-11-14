const { isMovableCell, isGatheredCell } = require('../utils').gameWorld.cellUtils;
const { sendIfIdsNotEquals, sendToAll } = require('./requestSenders');
const Request = require('../utils').Request;
const Person = require('../entries').characters.Person;

const {
  SESSION_ID,
  PERSON_DATA,
  PERSON_MOVABLE,
  PERSON_MOVE,
  GATHER,
  PERSON_DELETE
} = require('../constants').messageTypes;

module.exports = (webSocketServer, fieldMatrix) => {
  let clients = {};
  let characters = {};
  let id = null;

  webSocketServer.on('connection', function(ws) {
    id += 1;
    ws.id = id;
    clients[id] = ws;

    console.log(`new connection - ${id}`);

    clients[id].send(JSON.stringify(new Request({ type: SESSION_ID, request: id })));
    characters[id] = new Person({ id: id, isPlayer: true, column: 10, row: 10, health: 3, strength: 1 });

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

    ws.on('message', function(message) {
      let json = JSON.parse(message);
      console.log(message);

      let fromColumn;
      let fromRow;
      let toColumn;
      let toRow;

      switch (json.type) {
        case PERSON_MOVE:
          fromColumn = characters[ws.id].column;
          fromRow = characters[ws.id].row;
          toColumn = parseInt(json.request.column);
          toRow = parseInt(json.request.row);

          if (isMovableCell(fieldMatrix, fromRow, toRow, fromColumn, toColumn)) {
            clients[ws.id].send(JSON.stringify(
              new Request({ type: PERSON_MOVABLE, request: true })
            ));
            characters[ws.id].column = toColumn;
            characters[ws.id].row = toRow;

            sendIfIdsNotEquals(clients, null, ws.id, (client) => {
              client.send(JSON.stringify(
                new Request({ type: PERSON_MOVE, request: characters[ws.id] })
              ))
            });
          } else {
            clients[ws.id].send(JSON.stringify(
              new Request({ type: PERSON_MOVABLE, request: false })
            ));
          }
          break;

        case GATHER:
          let id = json.request.id;
          fromColumn = characters[ws.id].column;
          fromRow = characters[ws.id].row;
          toColumn = json.request.column;
          toRow = json.request.row;


          if (isGatheredCell(fieldMatrix, fromRow, fromColumn, toRow, toColumn, id)) {
            clients[ws.id].send(JSON.stringify(
              new Request({ type:  GATHER, request: true })
            ));
            characters[ws.id].column=toColumn;
            characters[ws.id].row=toRow;

            sendIfIdsNotEquals(clients, null, ws.id, (client) => {
              client.send(JSON.stringify(
                new Request({ type: GATHER, request: characters[ws.id] })
              ))
            });
          } else {
            clients[ws.id].send(JSON.stringify(
              new Request({ type: GATHER, request:false })
            ));
          }
          break;
      }
    });

    ws.on('close', function() {
      console.log(`connection closed ${ws.id}`);
      delete clients[ws.id];

      sendToAll(clients, (client) => {
        client.send(JSON.stringify(
          new Request({ type: PERSON_DELETE, request: characters[ws.id] })
        ));
      });

      delete characters[ws.id];
    });
  });
};