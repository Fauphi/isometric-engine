/*
* @Author: philipp
* @Date:   2016-11-22 20:31:42
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-25 23:26:17
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT, cartToIso, isoToCart } from './globals.js';
import { Tile } from './tile.js';
import { recalc } from './recalcHeight.js';

export class World {

	constructor(width, height, element) {
		this.width = width;
		this.height = height;
		this.blogCount = width*height;
		this.cv = document.createElement('canvas');
		this.activeTile = null;
		this.field = [];
		for(let x=0;x<this.width;x++) {
			let widthArray = [];
			for(let y=0;y<this.height;y++) {
				widthArray.push(0);
			}
			this.field.push(widthArray);
		}
		this.map = [];

		const container = element;

		container.style.textAlign = 'center';
		
		this.cv.width = width*(BLOG_WIDTH*2);
		this.cv.height = height*(BLOG_HEIGHT*2)+160;
		
		container.append(this.cv);

		this._generateMap();
		this._recalcMap();
		this._draw();		
		this._setupEvents();

		// this._animate(0);
	}

	_animate(x) {
		const that = this;
		setTimeout(()=>{
			if(this.map[x] && this.map[x+1]) {
				this.map[x][7].height = 0;
				this.map[x+1][7].height = 2;
				this._recalcMap();
				this._draw();
				that._animate(x+1);
			}
		},200);	
	}

	_generateMap() {
		this.map = [];
		for(let x=0;x<this.field.length;x++) {
			let widthArray = [];
			for(let y=0;y<this.field[x].length;y++) {
				widthArray.push(new Tile(x,y,this.cv.getContext("2d"),this.field[0].length,this.field[x][y]));
			}
			this.map.push(widthArray);
		}
		// add neighbors
		for(let x=0;x<this.map.length;x++) {
			for(let y=0;y<this.map[x].length;y++) {
				const tile = this.map[x][y];
				tile.addNeighbors(this._getNeighbors(x,y,tile.height));
			}
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
		const valid = (x>=0 && x<this.map.length && y>=0 && y<this.map[0].length);
		return valid;	
	}

	_draw() {
		this.cv.getContext("2d").clearRect(0, 0, this.cv.width, this.cv.height);

		this._drawGround();

		for(let x=0;x<this.map.length;x++) {
			for(let y=0;y<this.map[0].length;y++) {
				const tile = this.map[x][y];
				tile.draw(false);	
			}
		}
	}

	_drawGround() {
		const ctx = this.cv.getContext('2d');

		const darker = '#242B29'
		,	lighter = '#323C39'
		,	groundHeight = 520;

		const point = cartToIso({x: 0, y: this.map[0].length-1})
		,	startX = (this.map[0].length*BLOG_WIDTH) + point.x - BLOG_WIDTH
		,	startY = 40 + point.y + BLOG_HEIGHT;

		const pointMiddle = cartToIso({x: this.map.length-1, y: this.map[0].length-1})
		,	middleX = (this.map[0].length*BLOG_WIDTH) + pointMiddle.x
		,	middleY = 40 + pointMiddle.y + (BLOG_HEIGHT*2);

		const pointEnd = cartToIso({x: this.map.length-1, y: 0})
		,	endX = (this.map[0].length*BLOG_WIDTH) + pointEnd.x + BLOG_WIDTH
		,	endY = 40 + pointEnd.y + BLOG_HEIGHT;

		ctx.beginPath();
		ctx.fillStyle = lighter;

		ctx.moveTo(startX,startY);	    
	    ctx.lineTo(startX,startY+groundHeight);
	    ctx.lineTo(middleX,middleY+groundHeight);
	    ctx.lineTo(middleX,startY);
	    ctx.lineTo(startX,startY);

	    ctx.fill();

	    ctx.beginPath();
		ctx.fillStyle = darker;

		ctx.moveTo(middleX,endY);
	    ctx.lineTo(middleX,middleY+groundHeight);
	    ctx.lineTo(endX,endY+groundHeight);
	    ctx.lineTo(endX,endY);
	    ctx.lineTo(middleX,endY);

		ctx.fill();
	}

	_getNeighbors(x,y,height) {
		const neighbors = {
			nw: null,
			n: null,
			ne: null,
			w: null,
			e: null,
			sw: null,
			s: null,
			se: null
		};

		if(this._valid(x-1,y-1)) neighbors.nw = this.map[x-1][y-1];
		if(this._valid(x,y-1)) neighbors.n = this.map[x][y-1];
		if(this._valid(x+1,y-1)) neighbors.ne = this.map[x+1][y-1];

		if(this._valid(x-1,y)) neighbors.w = this.map[x-1][y];
		if(this._valid(x+1,y)) neighbors.e = this.map[x+1][y];

		if(this._valid(x-1,y+1)) neighbors.sw = this.map[x-1][y+1];
		if(this._valid(x,y+1)) neighbors.s = this.map[x][y+1];
		if(this._valid(x+1,y+1)) neighbors.se = this.map[x+1][y+1];

		return neighbors;
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

	        if(tile && (that.activeTile!=tile)) {
	        	if(that.activeTile) that.activeTile.draw(false);
				tile.draw(true);
				that.activeTile = tile;
		    }

	    }, false);

		that.cv.addEventListener('click', function(evt) {
	        var rect = that.cv.getBoundingClientRect()
	        ,	pos = {
	          	x: evt.clientX - rect.left,
	          	y: evt.clientY - rect.top
	        };
	        const tile = that._getTileAtCoord(pos.x,pos.y);

	        if(tile) {
	        	tile.changeHeight(tile.height+1);
        		that._recalcMap();
	        	that._draw();
	        }

	    }, false);

	    document.addEventListener('keydown', function(evt) {
	        if(that.activeTile) {
	        	const keyCode = evt.keyCode;
	        	let newHeight;
	        	// up
	        	if(keyCode==38) newHeight = that.activeTile.height+1;
	        	// down
	        	if(keyCode==40) newHeight = Math.max(0, that.activeTile.height-1);

	        	if(newHeight) {
	        		that.activeTile.changeHeight(newHeight);
	        		that._recalcMap();
		        	that._draw();
	        	}
	        }

	    }, false);
	
	}

	_getTileAtCoord(x,y) {
		x -= (this.map.length*BLOG_WIDTH);
		y -= 40;

		const coords = isoToCart({x: x, y: y});

		return (this.map[coords.x] && this.map[coords.x][coords.y])?this.map[coords.x][coords.y]:false;
	}

}

