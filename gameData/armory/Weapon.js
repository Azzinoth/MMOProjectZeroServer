function Weapon(id, itemId, ammoId, durability, damage, accuracy, distance) {
    this.id=id;
    this.itemId=itemId;
    this.ammoId = ammoId;
    this.durability = durability;
    this.damage = damage;
    this.accuracy = accuracy;
    this.distance = distance;
}
let WeaponProto = {
    id:null,
    ammoId:null,
    durability :null,
    damage : null,
    accuracy : null,
    distance : null
}