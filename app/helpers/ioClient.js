var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    io = require('socket.io-client')('http://localhost');

function IoClient () {};

util.inherits(IoClient, EventEmitter);

IoClient.prototype.start = function () {

};

IoClient.prototype.sendReq = function (cmd, args, callback) {
    console('***sendReq*** ' + cmd + ' , args: ' + args);
};

module.exports = IoClient;
