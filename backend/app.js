const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Stack = require('./Classes/Stack');
const Relay = require('./Classes/Relay');

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

(async () => {

    const stacks = await Stack.getStacks();
    const close = () => {
        stacks.forEach(stack => stack.close());
        server.close();
        process.exit();
    }

    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    stdin.on("data", (data) => {
            console.log(data);
            if (data === "q") {
                close();
            }
        }
    )
    try {
        const relay = new Relay(stacks, sockets);
        setInterval(() => {
            relay.tick();
        }, 50)
    } catch (e) {
        console.log(e);
        close();
    }


})();
