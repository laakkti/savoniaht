const devicesRouter = require('express').Router()
const Device = require('../models/device')

devicesRouter.get('/', async (request, response) => {
  const devices = await Device
    .find({})

  response.json(devices.map(u => u.toJSON()))
})

devicesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body   
  
    const device = new Device({
      name: body.name,
      email: body.email
      
    })

    console.log('backend new device    '+body)

    const savedDevice = await device.save()

    response.json(savedDevice)
  } catch (exception) {
    console.log('Exception ='+exception)
    next(exception)
  }
})

module.exports = devicesRouter