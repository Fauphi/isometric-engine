/*
* @Author: Philipp
* @Date:   2016-11-24 00:16:01
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-24 00:26:03
*/

'use strict';

let array = []
,	width = 0
,	height = 0;

const valid = (x,y) => {
	const valid = (x>=0 && x<width && y>=0 && y<height);
	return valid;	
}

const adjust = (x,y,newHeight,neighborHeight) => {
	let adjust = true;

	// center
	if(valid(x,y) && array[x][y]>=neighborHeight) adjust = false;
	// left
	if(valid(x-1,y-1) && array[x-1][y-1]>neighborHeight) adjust = false;
	if(valid(x,y-1) && array[x][y-1]>neighborHeight) adjust = false;
	if(valid(x+1,y-1) && array[x+1][y-1]>neighborHeight) adjust = false;
	// middle
	if(valid(x-1,y) && array[x-1][y]>neighborHeight) adjust = false;
	if(valid(x+1,y) && array[x+1][y]>neighborHeight) adjust = false;
	// right
	if(valid(x-1,y+1) && array[x-1][y+1]>neighborHeight) adjust = false;
	if(valid(x,y+1) && array[x][y+1]>neighborHeight) adjust = false;
	if(valid(x+1,y+1) && array[x+1][y+1]>neighborHeight) adjust = false;

	// need to adjust?
	if(adjust && valid(x,y)) {
		array[x][y] = newHeight;
		check(x,y,newHeight);
	} 
}

const check = (x,y,height) => {
	// left
	adjust(x-1, y-1, height-1, height);
	adjust(x, y-1, height-1, height);
	adjust(x+1, y-1, height-1, height);
	// middle
	adjust(x-1, y, height-1, height);
	adjust(x+1, y, height-1, height);
	// right
	adjust(x-1, y+1, height-1, height);
	adjust(x, y+1, height-1, height);
	adjust(x+1, y+1, height-1, height);
}

export const recalc = (a) => {
	array = a;
	if(array.length>0) {
		width = array.length;
		height = array[0].length;

		for(let i=0;i<array.length;i++) {
			for(let j=0;j<array.length;j++) {
				if(array[i][j]!=0) {
					check(i,j,array[i][j]);
				}
			}
		}
		return array;
	}
}