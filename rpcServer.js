'use strict';
const grpc = require('grpc');
const fs = require('fs');
const path = require('path');
const {log} = require('./utils/log4js.js');
const scheduleTask = require('./utils/schedule.js');
const CONFIG = require('./config.js');

class RpcServer {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.services = {};
        this.functions = {};
    }

    // 自动加载proto并且运行Server
    autoRun(protoDir) {
        let files = fs.readdirSync(protoDir);
        files.forEach((file) => {
            const filePart = path.parse(file);
            const serviceName = filePart.name;
            const packageName = filePart.name;
            const extName = filePart.ext;
            const filePath = path.join(protoDir, file);
            log.debug('file', file, filePart, serviceName, packageName, extName, filePath);
            if (extName === '.js') {
                const functions = require(filePath);
                this.functions[serviceName] = Object.assign({}, functions);
            } else if (extName === '.proto') {
                this.services[serviceName] = grpc.load(filePath)[packageName][serviceName].service;
            }
        });
        return this.runServer();
    }

    runServer() {
        const server = new grpc.Server();
        for(let serviceName in this.services) {
            const service = this.services[serviceName];
            server.addProtoService(service, this.functions[serviceName]);
        }
        server.bind(`${this.ip}:${this.port}`, grpc.ServerCredentials.createInsecure());
        server.start();
    }
};
module.exports = RpcServer;

const rpcServer = new RpcServer(CONFIG.bindIp, CONFIG.port);
rpcServer.autoRun(path.join(__dirname, './protos/'));
scheduleTask.doSomethingInMasterProcess();