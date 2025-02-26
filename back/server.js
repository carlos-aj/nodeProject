const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');  // Para trabajar con rutas de archivos

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",  // URL de tu frontend
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Sirve los archivos estáticos desde la carpeta "dist"
app.use(express.static(path.join(__dirname, '../dist')));

// Esta ruta responde cuando alguien accede a la raíz "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));  // Sirve el archivo index.html desde dist
});

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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
