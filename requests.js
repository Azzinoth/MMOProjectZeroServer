class Request {
	constructor({type = -1, request = null}) {
		this.type = type;
		this.request = request;
	}
}
module.exports = Request;