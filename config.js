'use strict';
const fs = require('fs');
const _ = require('underscore');
const CONFIG = {};
(()=> {
    try {
        _.extend(CONFIG, JSON.parse(fs.readFileSync(__dirname + '/env_config.json')));
    } catch (e) {
        console.log('init config catch err', e);
        process.exit(-1);
    }
})();
module.exports = CONFIG;