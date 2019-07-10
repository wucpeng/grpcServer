'use strict';
const schedule = require('node-schedule');
const {log} = require('./log4js.js');

exports.doSomethingInMasterProcess = ()=> {
    master5MinuteProcess();
    master5SecondProcess();
};

exports.doSomethingInWorkerProcess = ()=> {
    //log.debug('doSomethingInWorkerProcess');
};

let master5MinuteProcess = ()=> {
    let rule = new schedule.RecurrenceRule();
    rule.minute = [1,6,11,16,21,26,31,36,41,46,51,56];
    let job = schedule.scheduleJob(rule, ()=> {
        //log.debug('master5MinuteProcess');
    });
    return job;
};

let master5SecondProcess = ()=> {
    let rule = new schedule.RecurrenceRule();
    rule.second = [1,6,11,16,21,26,31,36,41,46,51,56];
    let job = schedule.scheduleJob(rule, ()=> {
        //log.debug('master5SecondProcess');
    });
    return job;
};



// 定义规则时使用
//[1,6,11,16,21,26,31,36,41,46,51,56]
//[0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19,20, 21, 22, 23, 24, 25, 26, 27, 28, 29,30, 31, 32, 33, 34, 35, 36, 37, 38, 39,40, 41, 42, 43, 44, 45, 46, 47, 48, 49,50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
//[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58]
//[0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57]