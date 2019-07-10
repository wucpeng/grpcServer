'use strict';
const grpc = require('grpc');
const fs = require('fs');
const path = require('path');
const CONFIG = require('./config.js');

class RpcClient {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.services = {};
        this.clients = {};
    }

    // 自动加载proto并且connect
    autoRun(protoDir) {
        let files = fs.readdirSync(protoDir);
        return files.forEach((file) => {
            const filePart = path.parse(file);
            const serviceName = filePart.name;
            const packageName = filePart.name;
            const extName = filePart.ext;
            const filePath = path.join(protoDir, file);
            if (extName === '.proto') {
                const proto = grpc.load(filePath);
                const Service = proto[packageName][serviceName];
                this.services[serviceName] = Service;
                this.clients[serviceName] = new Service(`${this.ip}:${this.port}`, grpc.credentials.createInsecure());
            }
        });
    }

    async invoke(serviceName, name, params) {
        return new Promise((resolve, reject)=> {
            function callback(error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            }
            params = params || {};
            if (this.clients[serviceName] && this.clients[serviceName][name]) {
                this.clients[serviceName][name](params, callback);
            } else {
                const error = new Error(`RPC endpoint: "${serviceName}.${name}" does not exists.`);
                reject(error);
            }
        });
    }
};
module.exports = RpcClient;

const rpcClient = new RpcClient(CONFIG.bindIp, CONFIG.port);
rpcClient.autoRun(path.join(__dirname, './protos/'));
let testSend = async ()=> {
    try {
        const result = await rpcClient.invoke('hello', 'sayHello', {code: "xxx", message: "dsfesafdaf"});
        console.log('result', result);
    } catch (err) {
        console.log('catch err', err);
    }
};
testSend().then();
