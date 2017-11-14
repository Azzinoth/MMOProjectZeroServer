class Person {
	constructor({id = null, isPlayer = true, column = 10, row = 10, health = 3, strength = 1}) {
		this.id = id;
		this.isPlayer = isPlayer;
		this.size = 64;
		this.column = column;
		this.row = row;
		this.health = health;
		this.strengh = strength;
		this.isAlive = true;
	}

	move(direction){
		switch(direction){
			case 0:
				this.column--;
			break;
			case 1:
				this.column--;
				this.row++;
			break;
			case 2:
				this.row++;
			break;
			case 3:
				this.column++;
				this.row++;
			break;
			case 4:
				this.column++;
			break;
			case 5:
				this.column++;
				this.row--;
			break;
			case 6:
				this.row--;
			break;
			case 7:
				this.column--;
				this.row--;
			break;
		}
	}
}

module.exports = Person;