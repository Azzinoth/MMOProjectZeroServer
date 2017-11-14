const WebSocketServer = require('ws');
const serversEvents = require('./serverEventsHandler');
const createLocation = require('./utils').gameWorld.createLocation;
const port = require('./config').port;

serversEvents(
  new WebSocketServer.Server(
    { port },
    () => console.log(`Server running on port ${port}...`)
  ),
  createLocation()
);