/*
* @Author: philipp
* @Date:   2016-11-22 20:31:42
* @Last Modified by:   philipp
* @Last Modified time: 2016-11-23 00:30:04
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT } from './globals.js';
import { Tile } from './tile.js';

export class World {

	constructor(width, height, element) {
		this.width = width;
		this.height = height;
		this.blogCount = width*height;
		this.field = [];
		this.cv = document.createElement('canvas');
		this.activeTile = null;
		// this.toolbar = document.createElement('div');
		this.toolbar = {activeType: 'road'};

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

		for(let i=0;i<this.blogCount;i++) {
			const x = i%this.width
			,	y = Math.floor(i/this.height)
			,	h = (i==399)?10:(i==269)?-20:0;

			this.field.push(new Tile(x,y,this.cv.getContext("2d"),this.width,h));
		}

		this._setupEvents();
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
	        	tile.draw(true);
		        
		        const newTileIndex = tile.x + (tile.y*that.width);
		        if(that.activeTile && that.activeTile!=newTileIndex) {
		        	that.field[that.activeTile].draw();
		        }
		        that.activeTile = newTileIndex;
		    }

	    }, false);

		that.cv.addEventListener('click', function(evt) {
	        var rect = that.cv.getBoundingClientRect()
	        ,	pos = {
	          	x: evt.clientX - rect.left,
	          	y: evt.clientY - rect.top
	        };
	        const tile = that._getTileAtCoord(pos.x,pos.y);

	        if(tile) tile.changeType(that.toolbar.activeType);

	    }, false);
		
	    document.addEventListener('keydown', function(evt) {
	    	let newType;
	    	switch (evt.keyCode) {
	    		case 49:
	    			newType = 'grass';
	    			break;
	    		case 50:
	    			newType = 'road';
	    			break;
	    		case 51:
	    			newType = 'house';
	    			break;
	    		default:
	    			newType = that.toolbar.activeType;
	    	}
	    	that.toolbar.activeType = newType;
	    }, false);
	}

	_getTileAtCoord(x,y) {
		x -= (this.width*BLOG_WIDTH);
		y -= 10;

		const tileX = Math.floor((x / (BLOG_WIDTH) + y / (BLOG_HEIGHT)) / 2)
		,	tileY = Math.floor((y / (BLOG_HEIGHT) -(x / (BLOG_WIDTH))) / 2);

		return (this.field[tileX + (tileY*this.width)])?this.field[tileX + (tileY*this.width)]:false;
	}

}

