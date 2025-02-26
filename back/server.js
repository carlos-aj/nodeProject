const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

let users = [];

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado:', socket.id);
    
    socket.on('join', (data) => {
        users.push({ id: socket.id, user: data.user, avatar: data.avatar });
        io.emit('users', users);
        io.emit('user-connected', data);
    });

    socket.on('disconnect', () => {
        const user = users.find(user => user.id === socket.id);
        if (user) {
            io.emit('user-disconnected', user);
        }
        users = users.filter(user => user.id !== socket.id);
        io.emit('users', users);
        console.log('Usuario desconectado');
    });

    socket.on('message', (data) => {
        io.emit('message', data); 
    });

    socket.on('typing', (data) => {
        io.emit('typing', data);
    });

    socket.on('stop-typing', (data) => {
        io.emit('stop-typing', data);
    });

    socket.on('update-user', (data) => {
        users = users.filter(user => user.id !== socket.id); 
        users.push({ id: socket.id, user: data.user, avatar: data.avatar }); 
        io.emit('users', users);
    });
});

server.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
