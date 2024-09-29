const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  if(username === '' || username.length < 3
    || password === '' || password.length < 3 ) {
    response.status(400).send({error: 'invalid username or password'})
  } else {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }

})

module.exports = usersRouter