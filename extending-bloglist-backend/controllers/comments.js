const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
require('express-async-errors')

commentsRouter.get('/', async (request, response) => { 
    const comments = await Comment.find({})
    response.json(comments)
})
  
module.exports = commentsRouter