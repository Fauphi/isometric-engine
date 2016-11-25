/*
* @Author: philipp
* @Date:   2016-11-22 23:35:14
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-25 23:42:26
*/

'use strict';

import { BLOG_WIDTH, BLOG_HEIGHT, HEIGHT_PIXEL, PADDING_TOP, cartToIso, isoToCart } from './globals.js';

export class Tile {

	constructor(x,y,ctx,worldWith,height=0) {
		this.x = x;
		this.y = y;
		this.ctx = ctx;
		this.worldWith = worldWith;
		this.active = false;
		this.type = 'grass'; // grass, road, house
		this.height = height;
		this.neighbors = {};
	}

	changeHeight(height) {
		this.height = height;
	}

	addNeighbors(neighbors) {
		this.neighbors = neighbors;
	}

	_addHeight(y) {
		return y + (-this.height*HEIGHT_PIXEL);
	}

	draw(mouseOver=false) {
		// transform coords
		const point = cartToIso({x: this.x, y: this.y})
		,	screenx = (this.worldWith*BLOG_WIDTH) + point.x;
		let screeny = PADDING_TOP + point.y;

		if(this.height!=0) screeny = this._addHeight(screeny);

		// draw
		const ctx = this.ctx;
		// get fill color
		if(!mouseOver) {
			let fillColor;
			
			switch (this.height) {
				case 3:
					fillColor = '#9CCE97';
					break;
  				case 2:
  					fillColor = '#80C37C';
  					break;
  				case 1:
  					fillColor = '#45B254';
  					break;
  				case 0:
  					fillColor = '#0E562A';
  					break;
  				default:
  					fillColor = 'white';
  			}

  			ctx.fillStyle = fillColor;
		} else {
			ctx.fillStyle = 'red';
		}

		ctx.beginPath();
		ctx.lineWidth = "0.3";
		ctx.strokeStyle = '#40986A';

		const addHeights = this._getBorderHeights();

		ctx.moveTo(screenx,screeny+(addHeights.top*HEIGHT_PIXEL));
	    
	    ctx.lineTo(screenx+(BLOG_WIDTH),screeny+(BLOG_HEIGHT)+(addHeights.right*HEIGHT_PIXEL));
	    ctx.lineTo(screenx,screeny+(BLOG_HEIGHT*2)+(addHeights.bottom*HEIGHT_PIXEL));
	    ctx.lineTo(screenx-(BLOG_WIDTH),screeny+(BLOG_HEIGHT)+(addHeights.left*HEIGHT_PIXEL));
	    ctx.lineTo(screenx,screeny+(addHeights.top*HEIGHT_PIXEL));

		ctx.fill();
		ctx.stroke();
	}

	_getBorderHeights() {
		let top = 0
		,	right = 0
		,	bottom = 0
		,	left = 0;

		if(this.neighbors.nw && this.height<this.neighbors.nw.height) top = this.height - this.neighbors.nw.height;
		if(this.neighbors.n && this.height<this.neighbors.n.height) {
			top = this.height - this.neighbors.n.height;
			right = this.height - this.neighbors.n.height;
		}
		if(this.neighbors.ne && this.height<this.neighbors.ne.height) right = this.height - this.neighbors.ne.height;

		if(this.neighbors.w && this.height<this.neighbors.w.height) {
			top = this.height - this.neighbors.w.height;
			left = this.height - this.neighbors.w.height;
		}
		if(this.neighbors.e && this.height<this.neighbors.e.height) {
			right = this.height - this.neighbors.e.height;
			bottom = this.height - this.neighbors.e.height;
		}

		if(this.neighbors.sw && this.height<this.neighbors.sw.height) left = this.height - this.neighbors.sw.height;
		if(this.neighbors.s && this.height<this.neighbors.s.height) {
			left = this.height - this.neighbors.s.height;
			bottom = this.height - this.neighbors.s.height;
		}
		if(this.neighbors.se && this.height<this.neighbors.se.height) bottom = this.height - this.neighbors.se.height;

		return {
			top: top,
			right: right,
			bottom: bottom,
			left: left
		}
	}

}