/*
* @Author: Philipp
* @Date:   2016-11-26 14:47:47
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-26 15:31:48
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT, HEIGHT_PIXEL, PADDING_TOP, cartToIso, isoToCart } from './globals.js';

export class Player {

	constructor(ctx,worldWidth) {
		this.ctx = ctx;
		this.position = {x: 0,y: 0};
		this.color = 'blue';
		this.worldWidth = worldWidth;
	}

	_addHeight(y) {
		return y + (-this.height*HEIGHT_PIXEL);
	}

	move(direction,visibleCoords,map) {
		let x = 0
		,	y = 0;
		switch (direction) {
			case 'top':
				y = Math.max(0, this.position.y-1);
				x = this.position.x;
				break;
			case 'left':
				x = Math.max(0, this.position.x-1);
				y = this.position.y;
				break;
			case 'bottom':
				y = this.position.y+1;
				x = this.position.x;
				break;
			case 'right':
				x = this.position.x+1;
				y = this.position.y;
				break;
		}

		const visX = visibleCoords.x
		,	visY = visibleCoords.y;

		const newMapPos = map[x][y];

		if(newMapPos.height==0 && x>=visX && x<visX+20 && y>=visY && y<visY+20) {
			this.position.x = x;
			this.position.y = y;

			this.draw(visibleCoords);
		}
	}

	draw(visibleCoords) {
		// transform coords
		const point = cartToIso({x: this.position.x, y: this.position.y}, visibleCoords)
		,	screenx = (this.worldWidth*BLOG_WIDTH) + point.x; // add padding stuff

		let screeny = PADDING_TOP + point.y; // add padding stuff

		// if(this.height!=0) screeny = this._addHeight(screeny); // add tile height

		// draw
		const ctx = this.ctx;
		ctx.beginPath();

		ctx.fillStyle = 'yellow';
		ctx.lineWidth = "0.3";
		ctx.strokeStyle = '#40986A';

		ctx.moveTo(screenx,screeny);
	    
	    ctx.lineTo(screenx+(BLOG_WIDTH),screeny+(BLOG_HEIGHT));
	    ctx.lineTo(screenx,screeny+(BLOG_HEIGHT*2));
	    ctx.lineTo(screenx-(BLOG_WIDTH),screeny+(BLOG_HEIGHT));
	    ctx.lineTo(screenx,screeny);

		ctx.fill();
		ctx.stroke();
	}

}