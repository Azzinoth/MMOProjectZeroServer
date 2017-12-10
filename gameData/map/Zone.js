function Zone (id, fromColumn, fromRow, toColumn, toRow, type){
    this.id = id;
    this.type = type;
    this.fromColumn = fromColumn;
    this.fromRow = fromRow;
    this.toColumn = toColumn;
    this.toRow = toRow;
}
let zonePtoto={
    id : null,
    type: null,
    fromColumn : null,
    fromRow : null,
    toColumn : null,
    toRow : null
}
module.exports = Zone;