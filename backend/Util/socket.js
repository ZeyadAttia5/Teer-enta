const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: process.env.FRONTEND_HOST || "http://localhost:3000/",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('myEvent', (data) => {
            console.log('Received data from client:', data);
            socket.emit('myEventResponse', { message: 'Hello from server!' });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

const getSocketIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getSocketIo };
