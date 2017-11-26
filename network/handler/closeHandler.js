const {
	HUMAN_DELETE
} = require('../../constants').messageTypes;
const Request = require('../Request');

function closeHandler(data, idCharacter){
    clients = data.clients;
    characters = data.characters;
    inventories = data.inventories;
	console.log('connection closed ' + idCharacter);
	delete clients[idCharacter];
	delete inventories[characters[idCharacter].idInventory];
	let requestDelete = new Request({type:HUMAN_DELETE, request:characters[idCharacter]});

	for (let key in clients) {
		clients[key].send(JSON.stringify(requestDelete));			
	}
	delete characters[idCharacter];
}
module.exports = closeHandler;