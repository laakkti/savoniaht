const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
      const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  console.log("#1user=" + user)
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  console.log("#2user=" + user)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  console.log("#3user=" + user.username)
  const token = jwt.sign(userForToken, process.env.SECRET)

  console.log("TOKEN " + token)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter