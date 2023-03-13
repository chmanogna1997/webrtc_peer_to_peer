const http = require('http');
const express = require('express');
const { Server: SocketIO } = require('socket.io');

const app = express()
const server = http.createServer(app);

const io = new SocketIO(server);
const PORT = 3000;

const users = new Map();

io.on('connection', socket =>{
    console.log(`user connected : ${socket.id}`)
    users.set(socket.id, socket.id);


    socket.broadcast.emit('user:joined', socket.id);
    socket.emit('hello', { id: socket.id });

    socket.on('outgoing:call', data=>{
        const {fromOffer,to} = data;
        console.log("in outgoing call: calling to ", to)
        socket.to(to).emit('incomming:call', {from:socket.id, offer:fromOffer})
    })

    socket.on('call:accepted', data =>{
        const {answer , to} = data;
        socket.to(to).emit('send:answer', {from:socket.id, offer:answer})
    })

    socket.on('disconnect', ()=>{
        console.log(`user disconnected ${socket.id}`)
        users.delete(socket.id)
    })
})


app.get('/users', (req,res)=>{
    return res.json(Array.from(users))
})





app.use(express.static('./Public'));

server.listen(PORT,()=>{console.log(`running port : ${PORT}`)})