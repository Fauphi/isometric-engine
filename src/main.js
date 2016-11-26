/*
* @Author: philipp
* @Date:   2016-11-22 20:30:45
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-26 00:56:29
*/

'use strict';

import { World } from './world.js';
import { recalc } from './recalcHeight.js';

new World(200, 200, document.getElementById('world'));