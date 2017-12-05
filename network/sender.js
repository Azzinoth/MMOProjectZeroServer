let data;
function setData (myData){
    data = myData;
}
function sendToAll(clients, request){
	for (let key in data.clients){
        data.clients[key].send(JSON.stringify(request));
    }
}
function sendToClient(id, request){
    data.clients[id].send(JSON.stringify(request));
	//client.send(JSON.stringify(request));
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
exports.setData = setData;