/*
* @Author: philipp
* @Date:   2016-11-22 20:31:42
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-25 01:52:08
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT } from './globals.js';
import { Tile } from './tile.js';
import { recalc } from './recalcHeight.js';

const print = (array) => {
	var text = '';
	for(let i=0;i<array.length;i++) {
		text += array[i][0]+"&nbsp;&nbsp;"+array[i][1]+"&nbsp;&nbsp;"+array[i][2]+"&nbsp;&nbsp;"+array[i][3]+"&nbsp;&nbsp;"+array[i][4]+'<br/>';
	}
	document.getElementById('grid').innerHTML = text;
}
const print2 = (array) => {
	var text = '';
	for(let i=0;i<array.length;i++) {
		text += array[i][0].height+"&nbsp;&nbsp;"+array[i][1].height+"&nbsp;&nbsp;"+array[i][2].height+"&nbsp;&nbsp;"+array[i][3].height+"&nbsp;&nbsp;"+array[i][4].height+'<br/>';
	}
	document.getElementById('grid2').innerHTML = text;
}

export class World {

	constructor(width, height, element) {
		this.width = width;
		this.height = height;
		this.blogCount = width*height;
		this.cv = document.createElement('canvas');
		this.activeTile = null;
		// this.toolbar = document.createElement('div');
		this.toolbar = {activeType: 'road'};
		this.field = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];
		this.map = [];

		const container = element
		,	div = document.createElement('div');

		container.style.textAlign = 'center';
		div.style.fontSize = '20px';
		div.style.padding = '20px 0px';
		div.style.fontFamily = 'Helvetica';

		this.cv.width = width*(BLOG_WIDTH*2);
		this.cv.height = height*(BLOG_HEIGHT*2)+40;
		div.innerHTML = 'World';

		container.append(div);
		// container.append(this.toolbar);
		container.append(this.cv);

		this._generateMap();
		this._recalcMap();

		this._draw();		

		this._setupEvents();
	}

	_generateMap() {
		this.map = [];
		for(let x=0;x<this.field.length;x++) {
			let widthArray = [];
			for(let y=0;y<this.field[0].length;y++) {
				widthArray.push(new Tile(x,y,this.cv.getContext("2d"),this.field[0].length,this.field[x][y]));
			}
			this.map.push(widthArray);
		}
	}

	_recalcMap() {
		let tmpArray = [];
		// create tmp array to recalc height
		for(let x=0;x<this.map.length;x++) {
			let widthArray = [];
			for(let y=0;y<this.map[0].length;y++) {
				widthArray.push(this.map[x][y].height);
			}
			tmpArray.push(widthArray);
		}

		tmpArray = recalc(tmpArray);
		
		// save back heights to map
		for(let x=0;x<this.map.length;x++) {	
			for(let y=0;y<this.map[0].length;y++) {
				this.map[x][y].height = tmpArray[x][y];
			}
		}
	}

	_valid(x,y) {
		const valid = (x>=0 && x<this.map[0].length && y>=0 && y<this.map.length);
		return valid;	
	}

	_draw() {
		this.cv.getContext("2d").clearRect(0, 0, this.cv.width, this.cv.height);

		for(let x=0;x<this.map.length;x++) {
			for(let y=0;y<this.map[0].length;y++) {
				const tile = this.map[x][y]
				,	height = tile.height;
				
				const heights = this._getHeights(tile,height);

				tile.draw(false, null, heights.top, heights.right, heights.bottom, heights.left);	
			}
		}
	}

	_getHeights(tile,height) {
		let top = 0
		,	right = 0
		,	bottom = 0
		,	left = 0;

		if(this._valid(tile.x-1,tile.y-1) && height<this.map[tile.x-1][tile.y-1].height) top = height - this.map[tile.x-1][tile.y-1].height;
		if(this._valid(tile.x,tile.y-1) && height<this.map[tile.x][tile.y-1].height) {
			top = height - this.map[tile.x][tile.y-1].height;
			right = height - this.map[tile.x][tile.y-1].height;
		}
		if(this._valid(tile.x+1,tile.y-1) && height<this.map[tile.x+1][tile.y-1].height) right = height - this.map[tile.x+1][tile.y-1].height;

		if(this._valid(tile.x-1,tile.y) && height<this.map[tile.x-1][tile.y].height) {
			top = height - this.map[tile.x-1][tile.y].height;
			left = height - this.map[tile.x-1][tile.y].height;
		}
		if(this._valid(tile.x+1,tile.y) && height<this.map[tile.x+1][tile.y].height) {
			right = height - this.map[tile.x+1][tile.y].height;
			bottom = height - this.map[tile.x+1][tile.y].height;
		}

		if(this._valid(tile.x-1,tile.y+1) && height<this.map[tile.x-1][tile.y+1].height) left = height - this.map[tile.x-1][tile.y+1].height;
		if(this._valid(tile.x,tile.y+1) && height<this.map[tile.x][tile.y+1].height) {
			left = height - this.map[tile.x][tile.y+1].height;
			bottom = height - this.map[tile.x][tile.y+1].height;
		}
		if(this._valid(tile.x+1,tile.y+1) && height<this.map[tile.x+1][tile.y+1].height) bottom = height - this.map[tile.x+1][tile.y+1].height;

		return {
			top: top,
			right: right,
			bottom: bottom,
			left: left
		}
	}

	_setupEvents() {
		const that = this;

		that.cv.addEventListener('mousemove', function(evt) {
	        var rect = that.cv.getBoundingClientRect()
	        ,	pos = {
	          	x: evt.clientX - rect.left,
	          	y: evt.clientY - rect.top
	        };
	        const tile = that._getTileAtCoord(pos.x,pos.y);

	        if(tile) {
	        	that._draw();
	        	const heights = that._getHeights(tile,tile.height);
				tile.draw(true, null, heights.top, heights.right, heights.bottom, heights.left);
		    }

	    }, false);

		that.cv.addEventListener('click', function(evt) {
	        var rect = that.cv.getBoundingClientRect()
	        ,	pos = {
	          	x: evt.clientX - rect.left,
	          	y: evt.clientY - rect.top
	        };
	        const tile = that._getTileAtCoord(pos.x,pos.y);
	        console.log(tile);

	        if(tile) {
	        	tile.changeHeight(tile.height+1);
        		that._recalcMap();
	        	that._draw();
	        }

	    }, false);
	
	}

	_getTileAtCoord(x,y) {
		x -= (this.map.length*BLOG_WIDTH);
		y -= 40;

		const tileX = Math.floor((x / (BLOG_WIDTH) + y / (BLOG_HEIGHT)) / 2)
		,	tileY = Math.floor((y / (BLOG_HEIGHT) - (x / (BLOG_WIDTH))) / 2);

		return (this.map[tileX] && this.map[tileX][tileY])?this.map[tileX][tileY]:false;
	}

}

