const SocketIO  = require('socket.io');
const {ret_room_id} = require('./sql/chat');

let connection_status = {};

const config = server => {
    const io = new SocketIO.Server(server, {
        path: '/socket.io',
        cors: {
            origin: "*",
        }
    });

    io.on('connection', socket => {
        let id;
        socket.on('chatroom', data => {
            id = ret_room_id();
            if(id == null || id == undefined) return;
            socket.join(id);
            if(connection_status[id] === undefined) connection_status[id] = 1;
            else connection_status[id]++;
            io.to(id).emit('status', connection_status[id]);
        });
        socket.on('navigation', data => {
            id = ret_room_id();
            if(id == null || id == undefined) {
                io.to(socket.id).emit('mode', 0);
                return;
            }
            id += 'navi';
            socket.join(id);
            if(connection_status[id] === undefined) connection_status[id] = 1;
            else connection_status[id]++;
            io.to(id).emit('status', connection_status[id]);
            io.to(socket.id).emit('mode', 1);
        });
        // message receives
        socket.on('msg', data => socket.broadcast.to(id).emit('msg', data));

        // send location
        socket.on('location', data => socket.broadcast.to(id).emit('location', data));
    
        // user connection lost
        socket.on('disconnecting', () => {
            connection_status[id]--;
            socket.to(id).emit('status', connection_status[id]);
            socket.leave(id);
        });
    });
}

module.exports = {config};