'use strict';
const {log} = require('../utils/log4js.js');
let sayHello = (call, callback)=> {
    log.debug(call.request);
    callback(null, {
        code: '0',
        message: '来自Node服务端的OK',
        xxx: "xxx"
    });
};

module.exports = {sayHello};