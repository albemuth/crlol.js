'use strict';

require('chai').should();
global._ = require('lodash');

global.rootRequire = function(relPath) {
    return require(process.cwd() + relPath + '.js');
}

