const { sendToAll } = require('../utils/requestSenders');
const Request = require('../../utils').Request;
const { PERSON_DELETE } = require('../../constants').messageTypes;

module.exports = (ws, clients, characters) => {
  console.log(`connection closed ${ws.id}`);
  delete clients[ws.id];

  sendToAll(clients, (client) => {
    client.send(JSON.stringify(
      new Request({ type: PERSON_DELETE, request: characters[ws.id] })
    ));
  });

  delete characters[ws.id];
};
