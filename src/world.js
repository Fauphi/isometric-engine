/*
* @Author: philipp
* @Date:   2016-11-22 20:31:42
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-26 15:29:38
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT, PADDING_TOP, cartToIso, isoToCart } from './globals.js';
import { Tile } from './tile.js';
import { recalc } from './recalcHeight.js';
import { MiniMap } from './minimap.js';
import { Player } from './player.js';

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
		this.visibleArea = [];
		this.visibleCoords = {x: 0, y: 0};
		this.visibleWidth = 20;


		const container = element;

		container.style.textAlign = 'center';
		
		this.cv.width = this.visibleWidth*(BLOG_WIDTH*2);
		this.cv.height = this.visibleWidth*(BLOG_HEIGHT*2)+260;
		
		container.append(this.cv);

		// minimap
		this.minimap = new MiniMap(document.getElementById('minimap'),this.map);

		this.player = new Player(this.cv.getContext('2d'),this.visibleWidth);

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
				widthArray.push(new Tile(x,y,this.cv.getContext("2d"),this.visibleWidth,this.field[x][y]));
				// widthArray.push(new Tile(x,y,this.cv.getContext("2d"),this.field[0].length,this.field[x][y]));
			}
			this.map.push(widthArray);
		}
		// create visible area
		this._createVisibleArea();

		// add neighbors
		for(let x=0;x<this.map.length;x++) {
			for(let y=0;y<this.map[x].length;y++) {
				const tile = this.map[x][y];
				tile.addNeighbors(this._getNeighbors(x,y,tile.height));
			}
		}
	}

	_createVisibleArea() {
		const startX = this.visibleCoords.x
		,	startY = this.visibleCoords.y;

		this.visibleArea = [];
		for(let x=startX;x<startX+this.visibleWidth;x++) {
			let widthArray = [];
			for(let y=startY;y<startY+this.visibleWidth;y++) {
				widthArray.push(this.map[x][y]);
			}
			this.visibleArea.push(widthArray);
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
		this.minimap.drawTarget(this.visibleCoords,this.map);

		for(let x=0;x<this.visibleArea.length;x++) {
			for(let y=0;y<this.visibleArea[x].length;y++) {
				const tile = this.visibleArea[x][y];
				tile.draw(false,this.visibleCoords);	
			}
		}

		this.player.draw(this.visibleCoords);
	}

	_drawGround() {
		const ctx = this.cv.getContext('2d');

		const darker = '#242B29'
		,	lighter = '#323C39'
		,	groundHeight = 520
		,	mapWidth = this.visibleArea.length
		,	mapHeight = this.visibleArea[0].length;

		const point = cartToIso({x: 0, y: mapHeight-1})
		,	startX = (mapHeight*BLOG_WIDTH) + point.x - BLOG_WIDTH
		,	startY = PADDING_TOP + point.y + BLOG_HEIGHT;

		const pointMiddle = cartToIso({x: mapWidth-1, y: mapHeight-1})
		,	middleX = (mapHeight*BLOG_WIDTH) + pointMiddle.x
		,	middleY = PADDING_TOP + pointMiddle.y + (BLOG_HEIGHT*2);

		const pointEnd = cartToIso({x: mapWidth-1, y: 0})
		,	endX = (mapHeight*BLOG_WIDTH) + pointEnd.x + BLOG_WIDTH
		,	endY = PADDING_TOP + pointEnd.y + BLOG_HEIGHT;

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
	        	if(that.activeTile) that.activeTile.draw(false,that.visibleCoords);
				tile.draw(true,that.visibleCoords);
				that.activeTile = tile;
		    }

	    }, false);

		that.cv.addEventListener('click', function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
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
	        // if(that.activeTile) {
	        	const keyCode = evt.keyCode;
	        	// let newHeight;
	        	// // up
	        	// if(keyCode==38) newHeight = that.activeTile.height+1;
	        	// // down
	        	// if(keyCode==40) newHeight = Math.max(0, that.activeTile.height-1);

	        	// if(newHeight) {
	        	// 	that.activeTile.changeHeight(newHeight);
	        	// 	that._recalcMap();
		        // 	that._draw();
	        	// }

	        	// move player
	        	if(keyCode==87) that.player.move('top',that.visibleCoords,that.map);
	        	else if(keyCode==65) that.player.move('left',that.visibleCoords,that.map);
	        	else if(keyCode==83) that.player.move('bottom',that.visibleCoords,that.map);
	        	else if(keyCode==68) that.player.move('right',that.visibleCoords,that.map);

	        	// add water
	        	if(keyCode==84) {
	        		if(that.activeTile) {
			        	that.activeTile.changeType('water');
		        		that._recalcMap();
			        	that._draw();
			        }
	        	}

	        	// change map focus
	        	const speed = 1;
	        	if(keyCode==38) that.visibleCoords = {x: Math.max(0, that.visibleCoords.x-speed), y: Math.max(0, that.visibleCoords.y-speed)};
	        	else if(keyCode==40) that.visibleCoords = {x: Math.min(that.map.length-that.visibleWidth, that.visibleCoords.x+speed), y: Math.min(that.map[0].length-that.visibleWidth, that.visibleCoords.y+speed)};
	        	else if(keyCode==37) that.visibleCoords = {x: Math.max(0, that.visibleCoords.x-speed), y: Math.min(that.map[0].length-that.visibleWidth, that.visibleCoords.y+speed)};
	        	else if(keyCode==39) that.visibleCoords = {x: Math.min(that.map.length-that.visibleWidth, that.visibleCoords.x+speed), y: Math.max(0, that.visibleCoords.y-speed)};
	        	that._createVisibleArea();
	        	that._draw();

	        	

	        // }

	    }, false);
	
	}

	_getTileAtCoord(x,y) {
		// x -= (this.map.length*BLOG_WIDTH);
		x -= (this.visibleWidth*BLOG_WIDTH);
		y -= PADDING_TOP;

		const coords = isoToCart({x: x, y: y});

		return (this.visibleArea[coords.x] && this.visibleArea[coords.x][coords.y])?this.visibleArea[coords.x][coords.y]:false;
	}

}

