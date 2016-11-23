/*
* @Author: philipp
* @Date:   2016-11-22 23:35:14
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-23 22:39:43
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT, HEIGHT_PIXEL, cartToIso, isoToCart } from './globals.js';

export class Tile {

	constructor(x,y,ctx,worldWith,height=0) {
		this.x = x;
		this.y = y;
		this.ctx = ctx;
		this.worldWith = worldWith;
		this.active = false;
		this.type = 'grass'; // grass, road, house
		this.height = height;

		this.draw();
	}

	changeType(type) {
		this.type = type;
		this.draw();
	}

	changeHeight(height) {
		this.height = height;
		this.draw();
	}

	_addHeight(y) {
		return y + (-this.height*HEIGHT_PIXEL);
	}

	draw(mouseOver=false, screenY=null) {
		// transform coords
		const point = cartToIso({x: this.x, y: this.y})
		,	screenx = (this.worldWith*BLOG_WIDTH) + point.x;
		let screeny = 10 + point.y;

		if(this.height!=0) screeny = this._addHeight(screeny);

		// draw
		const ctx = this.ctx;
		// get fill color
		if(!this.active) {
			let fillColor;
			
			switch (this.type) {
  				case 'grass':
  					fillColor = (mouseOver)?'darkgreen':'green';
  					break;
  				case 'road':
  					fillColor = (mouseOver)?'#707070':'grey';
  					break;
  				case 'house':
  					fillColor = (mouseOver)?'darkred':'red';
  					break;
  				default:
  					fillColor = (mouseOver)?'lightgrey':'white';
  			}

  			ctx.fillStyle = fillColor;

		} else {
			ctx.fillStyle = 'grey';
		}

		ctx.beginPath();
		ctx.lineWidth = "2";
		ctx.strokeStyle = 'black';

		ctx.moveTo(screenx,screeny);
	    
	    ctx.lineTo(screenx+(BLOG_WIDTH),screeny+(BLOG_HEIGHT));
	    ctx.lineTo(screenx,screeny+(BLOG_HEIGHT*2));
	    ctx.lineTo(screenx-(BLOG_WIDTH),screeny+(BLOG_HEIGHT));
	    ctx.lineTo(screenx,screeny);

		ctx.fill();
		ctx.stroke();
	}

}