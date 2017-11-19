class MapItem {
    constructor({id = -1, type = null, size = 10}) {
        this.id = id;
        this.type = type;
		this.size = size;
    }
}

module.exports = MapItem;