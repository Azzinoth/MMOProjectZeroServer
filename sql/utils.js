let id=null;

function getId(whatId){
	switch (whatId){
		case 'character':{
			return ++id;
		}
		break;
		case 'inventory':{
			return ++id;
		}
		break;
		case 'inventory':{
			return ++id;
		}
		break;
		default:{
			return ++id;
		}
	}		
}
exports.getId = getId;