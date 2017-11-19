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
exports.bubbleSort = bubbleSort;
