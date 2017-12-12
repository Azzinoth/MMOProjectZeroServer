function bubbleSort(arr){
   for (let i = 0; i<arr.length; i++){
		for (let j = 0; j<arr.length; j++){
			if (arr[i].size<arr[j].size){
				let tmp = arr[j];
				arr[j] = arr[i];
				arr[i] = tmp;
			}else if(arr[i].size===arr[j].size&&i>j){
                let tmp = arr[j];
                arr[j] = arr[i];
                arr[i] = tmp;
			}
		}
   }
}
function bubbleSortDown(arr){
    for (let i = 0; i<arr.length; i++){
        for (let j = 0; j<arr.length; j++){
            if (arr[i]>arr[j]){
                let tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }else if(arr[i]===arr[j]&&i<j){
                let tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }
    }
    return arr;
}
function bubbleSortUp(arr){
    for (let i = 0; i<arr.length; i++){
        for (let j = 0; j<arr.length; j++){
            if (arr[i]<arr[j]){
                let tmp = arr[j];
                arr[j] = arr[i];
                arr[i] = tmp;
            }else if(arr[i]===arr[j]&&i>j){
                let tmp = arr[j];
                arr[j] = arr[i];
                arr[i] = tmp;
            }
        }
    }
    return arr;
}
exports.bubbleSort = bubbleSort;
exports.bubbleSortUp = bubbleSortUp;
exports.bubbleSortDown = bubbleSortDown;
