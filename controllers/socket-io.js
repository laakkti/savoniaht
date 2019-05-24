const socket_io = (app, server) => {

  const socketIo = require('socket.io');
  const io = socketIo(server);


  io.on('connection', socket => {

    //app.ioall = io.sockets
    //app.io = socket

    console.info('New client connected ' + socket.id.toString())
    socket.emit("connected", socket.id)

    socket.on('disconnect', () => console.log('Client disconnected'));

    // Android lähettää myös ideen joka on selaimen id, saatu emaililla
    socket.on('gtwmob.notify', (data, id) => {

      if (id) {
        console.log('Client sent message: ' + data + "  id=" + id)

        socket.broadcast.to(id).emit('Ready2Start', data);
      }

    });

    socket.on('client', (data, id) => {
      console.log('Client sent message: ' + data + "   id= " + id)
      //socket.emit('FromAPI', 'tervetulloo')
    }
    );

  }
  );
}

module.exports = socket_io
