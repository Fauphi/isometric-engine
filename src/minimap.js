/*
* @Author: Philipp
* @Date:   2016-11-26 00:57:57
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-26 15:41:07
*/

'use strict';

export class MiniMap {
	
	constructor(element,map,worldWidth,visibleWidth) {
		this.cv = document.createElement('canvas');
		this.map = map;
		
		const container = element;
		container.style.textAlign = 'center';
		
		this.cv.width = 300;
		this.cv.height = 300;
		
		container.append(this.cv);

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
	        // const tile = that._getTileAtCoord(pos.x,pos.y);
	        console.log(pos);

	   //      if(tile && (that.activeTile!=tile)) {
	   //      	if(that.activeTile) that.activeTile.draw(false,that.visibleCoords);
				// tile.draw(true,that.visibleCoords);
				// that.activeTile = tile;
		  //   }

	    }, false);
	}

	draw(map=[]) {
		const ctx = this.cv.getContext('2d');
		ctx.beginPath();
		
		// ctx.lineWidth = '1';
		ctx.fillStyle = '#8A9735';

		ctx.fillRect(0,0,200,200);
		
		this.map = map;

		for(let x=0;x<this.map.length;x++) {
			for(let y=0;y<this.map[x].length;y++) {
				const tile = this.map[x][y];
				if(tile.height>0) {
					let fillColor;

					if(tile.type=='earth') {
						switch (tile.height) {
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
		  			} else if(tile.type=='water' && tile.height==-1) {
		  				console.log('WATER');
		  				fillColor = '#269387';
		  			}

					ctx.lineWidth = '0.3';
					ctx.fillStyle = fillColor;
					ctx.fillRect(x,y,1,1);
				}
			}
		}
		this.drawGround();
	}

	drawGround() {
		const ctx = this.cv.getContext('2d')
		,	darker = '#242B29'
		,	lighter = '#323C39';
		
		ctx.beginPath();
		ctx.fillStyle = darker;

		ctx.moveTo(200,0);
		ctx.lineTo(250,50);
		ctx.lineTo(250,250);
		ctx.lineTo(200,200);
		ctx.lineTo(200,0);

		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle = lighter;

		ctx.moveTo(200,200);
		ctx.lineTo(250,250);
		ctx.lineTo(50,250);
		ctx.lineTo(0,200);

		ctx.fill();
	}

	drawTarget(visibleCoords,map) {
		const ctx = this.cv.getContext('2d');
		ctx.clearRect(0, 0, 200, 200);

		this.draw(map,ctx);

		ctx.beginPath();

		const x = visibleCoords.x
		,	y = visibleCoords.y;

		ctx.lineWidth = '1';
		ctx.strokeStyle = 'red';

		ctx.rect(x,y,20,20);
		ctx.stroke();
	}

}