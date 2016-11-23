/*
* @Author: philipp
* @Date:   2016-11-22 23:35:14
* @Last Modified by:   philipp
* @Last Modified time: 2016-11-23 00:25:50
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT } from './globals.js';

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

	draw(mouseOver=false, screenY=null) {
		const ctx = this.ctx;

		const screenx = ((this.worldWith*BLOG_WIDTH)) + (this.x - this.y) * (BLOG_WIDTH);
		const screeny = (10+(this.x + this.y) * (BLOG_HEIGHT))+this.height;

		ctx.beginPath();
		ctx.lineWidth = "2";
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

		} else ctx.fillStyle = 'grey';
		
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