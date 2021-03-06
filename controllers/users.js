const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('datas', { content: 1, date: 1 })

  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body   
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    console.log('backend new user    '+body)

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    console.log('Exception ='+exception)
    next(exception)
  }
})

module.exports = usersRouter