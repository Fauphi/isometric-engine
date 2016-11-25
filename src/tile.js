/*
* @Author: philipp
* @Date:   2016-11-22 23:35:14
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-25 01:37:31
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT, HEIGHT_PIXEL, cartToIso, isoToCart } from './globals.js';

export class Tile {

	constructor(x,y,ctx,worldWith,height=0,neighbors) {
		this.x = x;
		this.y = y;
		this.ctx = ctx;
		this.worldWith = worldWith;
		this.active = false;
		this.type = 'grass'; // grass, road, house
		this.height = height;

		// this.draw();
	}

	changeType(type) {
		this.type = type;
		this.draw();
	}

	changeHeight(height) {
		this.height = height;
	}

	_addHeight(y) {
		return y + (-this.height*HEIGHT_PIXEL);
	}

	draw(mouseOver=false, screenY=null, top, right, bottom, left) {
		// transform coords
		const point = cartToIso({x: this.x, y: this.y})
		,	screenx = (this.worldWith*BLOG_WIDTH) + point.x;
		let screeny = 40 + point.y;

		if(this.height!=0) screeny = this._addHeight(screeny);

		// draw
		const ctx = this.ctx;
		// get fill color
		if(!mouseOver) {
			let fillColor;
			
			switch (this.height) {
  				case 2:
  					fillColor = 'lightgreen';
  					break;
  				case 1:
  					fillColor = 'green';
  					break;
  				case 0:
  					fillColor = 'darkgreen';
  					break;
  				default:
  					fillColor = 'white';
  			}

  			ctx.fillStyle = fillColor;

		} else {
			console.log('mouseOver');
			ctx.fillStyle = 'red';
		}

		ctx.beginPath();
		ctx.lineWidth = "2";
		ctx.strokeStyle = 'black';

		ctx.moveTo(screenx,screeny+(top*HEIGHT_PIXEL));
	    
	    ctx.lineTo(screenx+(BLOG_WIDTH),screeny+(BLOG_HEIGHT)+(right*HEIGHT_PIXEL));
	    ctx.lineTo(screenx,screeny+(BLOG_HEIGHT*2)+(bottom*HEIGHT_PIXEL));
	    ctx.lineTo(screenx-(BLOG_WIDTH),screeny+(BLOG_HEIGHT)+(left*HEIGHT_PIXEL));
	    ctx.lineTo(screenx,screeny+(top*HEIGHT_PIXEL));

		ctx.fill();
		ctx.stroke();
	}

}