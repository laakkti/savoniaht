const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const devicesRouter = require('./controllers/devices')
const datasRouter = require('./controllers/datas')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const infoRouter = require('./controllers/info')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/datas', datasRouter)
app.use('/api/devices', devicesRouter)
app.use('/api/info', infoRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

//const infoR = require('express').Router()
//const info=express.Router();

//infoR.get("/addr", (req, res) => {
/*
app.get("/addr", (req, res) => {
  console.log("%%%%%%%%%%%%%%%%%%")
}
)*/
//app.use('.', infoR)



//app.use(express.static('asset'))
//const ip = require("ip");

//console.log( ip.address());



/****************************/

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


const http = require('http')

const server = http.createServer(app)


/********************************************************/
const socketIo = require('socket.io');
const io = socketIo(server);

//var app = express();
//app.io = require('socket.io')();

io.on('connection', socket => {

  //app.set('socketio',socket)
  app.ioall = io.sockets
  app.iox = socket  
  app.socket=socket

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
/********************************************************/

/****************************/

//const socket_io = require('./controllers/socket-io')
//socket_io(app, server)
//muuta takaisin luokkaan

/****************************/

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

module.exports = {app}