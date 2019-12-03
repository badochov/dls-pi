const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Arduino = require('./Classes/Arduino').Arduino;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

const sockets = [];
io.on('connection', (socket) => {
    sockets.push(socket)
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

const sendMessage = (sockets, msg) => {
    sockets.forEach((socket) => socket.emit(msg))
};


const arduinos = Arduino.getArduinos();

