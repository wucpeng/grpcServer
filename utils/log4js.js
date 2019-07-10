'use strict';
const log4js = require('log4js');
log4js.configure({
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID',
    disableClustering: true,
    appenders: {
        error: {
            type: 'file',           //日志类型
            category: 'errLogger',    //日志名称
            filename: __dirname + '/../logs/error.log/', //日志输出位置，当目录文件或文件夹不存在时自动创建
            maxLogSize: 104800, // 文件最大存储空间
            backups: 100,  //当文件内容超过文件存储空间时，备份文件的数量
            //pm2: true,
            //pm2InstanceVar: 'INSTANCE_ID'
        },
        response: {
            type: 'dateFile',
            category: 'resLogger',
            filename: __dirname + '/../logs/log.log',
            pattern: 'yyyy-MM-dd', //日志输出模式
            alwaysIncludePattern: true,
            //pm2: true,
            //pm2InstanceVar: 'INSTANCE_ID'
            //maxLogSize: 104800,
            //backups: 100
        }
    },
    categories: {
        error: {appenders: ['error'], level: 'error'},
        response: {appenders: ['response'], level: 'info'},
        default: { appenders: ['response'], level: 'info'}
    },
    replaceConsole: true,
});

let logger = {};
let errorLogger = log4js.getLogger('error');
let resLogger = log4js.getLogger('response');
let formatError = (ctx, err,costTime) => {
    let method = ctx.method;
    let url = ctx.url;
    let body = ctx.request.body;
    let userAgent = ctx.header.userAgent;
    return {method, url, body, costTime, err, userAgent};
};

// 封装错误日志
logger.errLogger = (ctx, error, resTime) => {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

// 封装响应日志
logger.resLogger = (ctx, resTime) => {
    if (ctx) resLogger.info(`${ctx.method} ${ctx.url} ${ctx.status} ${ctx.length} - ${resTime} ms ${ctx.ip}`);
};

let logUtil = log4js.getLogger();
logUtil.level = "debug";
logger.log = logUtil;

module.exports = logger;
