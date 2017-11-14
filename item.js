class Item {
    constructor({id = -1, type = null, stackSize = 10}) {
        this.id = id;
        this.type = type;
		this.stackSize = stackSize;
    }
}
exports.Item = Item;