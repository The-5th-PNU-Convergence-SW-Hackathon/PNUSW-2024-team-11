const SocketIO  = require('socket.io');
const {ret_room_id} = require('./sql/chat');

let connection_status = {};

const config = server => {
    const io = new SocketIO.Server(server, {
        path: '/socket.io',
        // cors: {
        //     origin: "*",
        // }
    });

    io.on('connection', socket => {
        const id = ret_room_id();
        
        socket.join(id);
        if(connection_status[id] === undefined) connection_status[id] = 1;
        else connection_status[id]++;
        // console.log(connection_status);
        io.to(id).emit('status', connection_status[id]);
        
        // message receives
        socket.on('msg', data => socket.broadcast.to(id).emit('msg', data));
    
        // user connection lost
        socket.on('disconnecting', () => {
            connection_status[id]--;
            socket.to(id).emit('status', connection_status[id]);
            socket.leave(id);
        });
    });
}

module.exports = {config};