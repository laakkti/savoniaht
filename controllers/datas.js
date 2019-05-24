
const datasRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Data = require('../models/data')
const User = require('../models/user')

const mongoose = require('mongoose')

//import server from '../app';
const app = require('../app')

//console.log("xxxx =" + app.ioall)

datasRouter.get('/queryReady', async (request, response) => {

  let socketId = request.query.socketId
  //let socketId = request.query.socketId
  console.log("queryReady==== " + socketId + "  " + clientId)


  response.send(clientId === socketId);

})


/*
datasRouter.get('/queryAddress', async(request, response) => {

  var ip = require("ip");
  
  console.log("ip.address==== " + ip.address())


  response.send(ip.address());

})
*/
datasRouter.get('/titles', async (request, response) => {

  let user = request.query.user
  console.log("param= " + user);

  user = await User.findOne({ username: user })
  //console.log("userdata from user_table= " + user._id);


  //let id=user.toString(); 

  // tämä   
  //const dataset_title = "gtw.mob_test"

  /*
    let titles = request.query.titles
  
    let sel = ''
    if (titles)
      sel = 'dataset'
    else
      sel = '*'
  */
  // findin sisäällä query ehto eli käyttäjä sekä datasetin  
  const datas = await Data
    //.find({ "user": mongoose.Types.ObjectId(user._id) }).select('dataset date')

    .find({ "user": mongoose.Types.ObjectId(user._id) }, 'dataset date')


  //.find({ "user": mongoose.Types.ObjectId(user._id), "dataset": dataset_title }) //.populate('user', { username: 1, name: 1 })


  response.json(datas.map(data => data.toJSON()))
})

datasRouter.get('/:id', async (request, response, next) => {
  try {
    const data = await Data.findById(request.params.id)

    if (data) {
      response.json(data.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const getSocketIdFrom = request => {
  return request.get('SocketId')

}

const getTitleFrom = request => {
  return request.get('Title')

}


// ei käyttöä
datasRouter.post('/device', async (request, response, next) => {
  const body = request.body
  console.log("---------------------------------------- " + body)
});

let clientId = "THL"

datasRouter.post('/', async (request, response, next) => {
  const body = request.body

  //console.log(body)

  console.log("----------------------------------------")
  //console.log(body.latitude);

  console.log("data count== " + body.hourly.data.length);
  console.log("time= " + body.hourly.data[0].time);
  console.log("temperature= " + body.hourly.data[0].temperature);
  console.log("pressure= " + body.hourly.data[0].pressure);
  console.log("humidity= " + body.hourly.data[0].humidity);
  console.log("windSpeed= " + body.hourly.data[0].windSpeed);
  console.log("ozone= " + body.hourly.data[0].ozone);
  console.log("----------------------------------------")
  var unixtime = body.hourly.data[0].time;
  var newDate = new Date();
  newDate.setTime(unixtime * 1000);
  dateString = newDate.toUTCString();
  console.log("AIKA=" + dateString);
  console.log("----------------------------------------")
  console.log(getTokenFrom(request))
  console.log("-------------------------------------")

  const cnt = body.hourly.data.length



  var i;
  for (i = 0; i < cnt; i++) {
  }


  const dataset = []


  body.hourly.data.forEach(item => {

    const content = {
      time: item.time,
      temperature: item.temperature,
      pressure: item.pressure,
      humidity: item.humidity,
      windspeed: item.windSpeed,
      ozone: item.ozone
    }

    dataset.push(content)
  });


  /*
    const con tent = {
      time: body.hourly.data[0].time,
      temperature: body.hourly.data[0].temperature,
      pressure: body.hourly.data[0].pressure,
      humidity: body.hourly.data[0].humidity,
      windspeed: body.hourly.data[0].windSpeed,
      ozone: body.hourly.data[0].ozone
  
    }
  */
  // token pitäisi saada parametrina, emailista luetaan


  const title = getTitleFrom(request)
  console.log("######################### Dataset Title " + title)

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    console.log("USER ID FROM TOKEN " + decodedToken.id + "   user.id= " + user._id)

    const data = new Data({
      dataset: title,
      content: dataset,
      date: new Date(),
      user: user._id
    })



    //const savedData = await data.save()

    //console.log("savedData= " + savedData)

    const socketId = getSocketIdFrom(request)

    clientId = socketId

    console.log("contact from Android clientId=" + clientId)



    console.log("App= " + request.app.iox)
    console.log("App,heippa= " + request.app.heippa)
    //console.log("backend sockeId= " +socketId)

    /*****************************************/
    // tämä sulkee kaikki dialogit kohteessa eli lähetetään viesti kaikille!!!    

    //    request.app.ioall.emit('FromAPI', "")


    /*****************************************/
    //request.app.socket.broadcast.to(socketId).emit('FromAPIxxx', "xxx")
    try {
      request.app.socket.broadcast.to(socketId).emit('NewData', "xxx")
      //request.app.io.broadcast.to(socketId).emit('NewData', "xxx")
      request.app.io.emit('NewData', "xxx")

    } catch (error) {

      console.log("Error= "+error)
    }
    /*****************************************/


    //let socket=request.app.get('socketio')

    //console.log("backend soc= " +socket)

    //socket.broadcast.to(socketId).emit('FromAPI', "");

    //app.io.sockets.emit('NewData',socketId)

    //app.ioall.emit('NewData',socketId)
    //app.ioall.emit('FromAPI',socketId)

    //app.io.sockets.to(socketId).emit('FromAPI', "");
    //app.io.to(socketId).emit('FromAPI', "");
    //let socket=app.get("socket")

    //app.ioall.connected(socketId).emit('FromAPI', "");
    //app.io.sockets.connected(socketId).emit('FromAPI', "");
    //    socket.broadcast.to(socketId).emit('FromAPI', "");

    /*
    app.io.socket.broadcast.to(socketId).emit('FromAPI', "");
    app.io.socket.to(socketId).emit('FromAPI', "");
    
    app.socket.broadcast.to(socketId).emit('NewDataSaved', "");
    app.socket.to(socketId).emit('NewDataSaved', "");

    app.io.broadcast.to(socketId).emit('NewDataSaved', "");
    app.io.to(socketId).emit('NewDataSaved', "");
    */
    //app.ioall.emit('FromAPI','Heipparallaa kaikille')


    // tee funktio app.js:ään jota kutsutaan

    //app.heippa(socketId)
    //app.io.broadcast.to(socketId).emit('NewDataSaved', data);

    // käyttäjän datat taulukkoon, muista myös poistettaessa //ehkä turha   
    /*
       user.datas = user.datas.concat(savedData._id) 
       await user.save()  //highlight-line
       response.json(savedData.toJSON())
   */
  } catch (exception) {

    console.log(exception)
    next(exception)
  }

})

datasRouter.delete('/:id', async (request, response, next) => {
  try {
    await Data.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})


module.exports = datasRouter