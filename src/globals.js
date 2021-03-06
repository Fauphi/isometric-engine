/*
* @Author: philipp
* @Date:   2016-11-22 23:35:25
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-26 00:38:14
*/

'use strict';

export const BLOG_WIDTH = 30;
export const BLOG_HEIGHT = BLOG_WIDTH / 2;
export const HEIGHT_PIXEL = BLOG_WIDTH / 2;
export const PADDING_TOP = 140;

export const isoToCart = (pt) => {
	const tempPt = {x: 0, y: 0};
	tempPt.x = Math.floor(((2 * pt.y + pt.x) / 2) / BLOG_WIDTH);
	tempPt.y = Math.floor(((2 * pt.y - pt.x) / 2) / BLOG_WIDTH);
	return tempPt;
}

export const cartToIso = (pt,visibleCoords=null) => {
	const tempPt = {x: 0, y: 0};
	if(visibleCoords) {
		tempPt.x = ((pt.x-visibleCoords.x) - (pt.y-visibleCoords.y)) * BLOG_WIDTH;
		tempPt.y = (((pt.x-visibleCoords.x) + (pt.y-visibleCoords.y)) / 2) * BLOG_WIDTH;
	} else {
		tempPt.x = (pt.x - pt.y) * BLOG_WIDTH;
		tempPt.y = ((pt.x + pt.y) / 2) * BLOG_WIDTH;	
	}
	
	return tempPt;
}