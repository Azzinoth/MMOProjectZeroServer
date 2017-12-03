class MapItem {
    constructor({id = -1, type = null, objectId=null}) {
        this.id = id;
        this.type = type;
		this.size = 6;
        this.objectId = objectId;
    }
}

module.exports = MapItem;