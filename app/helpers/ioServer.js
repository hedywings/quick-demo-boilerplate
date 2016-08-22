var express = require('express'),
	http = require('http'),
	Io = require('socket.io');

var app = express(),
	server = http.createServer(app),
	io = new Io(server);

function IoServer () {};

IoServer.prototype.start = function () {
	server.listen(3001);
};

IoServer.prototype.sendInd = function (cmd, data) {
    console('***sendInd*** ' + cmd + ' , data: ' + data);
};

module.exports = IoServer;
