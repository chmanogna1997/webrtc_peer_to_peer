const http = require('http');
const express = require('express');
const {server:SocketIO} = require('socket.io');
const exp = require('constants');

const app = express()
const server = http.createServer(app);

const io = new SocketIO(server);
const PORT = 8000;

app.use(express.static('./Public'));

server.listen(PORT,()=>{console.log(`running port : ${PORT}`)})