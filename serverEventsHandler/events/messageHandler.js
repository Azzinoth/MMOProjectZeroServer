const { isMovableCell, isGatheredCell } = require('../../utils').gameWorld.cellUtils;
const { sendIfIdsNotEquals } = require('../utils/requestSenders');
const Request = require('../../utils').Request;

const {
  PERSON_MOVABLE,
  PERSON_MOVE,
  GATHER
} = require('../../constants').messageTypes;

module.exports = (message, ws, clients, characters, fieldMatrix) => {
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

    default:
      // TODO: add default handler which handle errors
  }
};
