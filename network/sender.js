function sendToAll(clients, request){
	for (let key in clients){
		clients[key].send(JSON.stringify(request));
	}
}
function sendToClient(client, request){
	clients.send(JSON.stringify(request));
}
function sendAllExcept(clients, request, id){
	for (let key in clients){
		if (key!=id){
			clients[key].send(JSON.stringify(request));
		}
	}
}
exports.sendToAll = sendToAll;
exports.sendToClient = sendToClient;
exports.sendAllExcept = sendAllExcept;