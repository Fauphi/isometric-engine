/*
* @Author: philipp
* @Date:   2016-11-22 20:30:45
* @Last Modified by:   Philipp
* @Last Modified time: 2016-11-25 23:18:27
*/

'use strict';

import { World } from './world.js';
import { recalc } from './recalcHeight.js';

new World(20, 20, document.getElementById('world'));