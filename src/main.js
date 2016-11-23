/*
* @Author: philipp
* @Date:   2016-11-22 20:30:45
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-24 00:21:07
*/

'use strict';

import { World } from './world.js';
import { recalc } from './recalcHeight.js';

// new World(20, 20, document.getElementById('world'));

// recalc height test
let array = [
	[3,0,0,0,0],
	[0,0,0,0,0],
	[0,0,2,0,0],
	[0,0,0,0,0],
	[0,0,0,0,3]
];

array = recalc(array);

const print = (array) => {
	for(let i=0;i<array.length;i++) {
		document.write(array[i][0]+"&nbsp;&nbsp;"+array[i][1]+"&nbsp;&nbsp;"+array[i][2]+"&nbsp;&nbsp;"+array[i][3]+"&nbsp;&nbsp;"+array[i][4]+'<br/>');
	}
}

print(array);