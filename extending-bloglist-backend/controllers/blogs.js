const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => { 
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
  
blogsRouter.get('/:id', (request, response, next) => {
    Blog
    .findById(request.params.id)
      .then((blog) => {
        if (blog) {
          response.json(blog);
        } else {
          response.status(404).end();
        }
      })
      .catch((error) => next(error));
});
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })
  
  if(blog.title === "" || blog.url === "") {
    response.status(400).json()
  } else {
    const savedBlog = await blog.save()
    await savedBlog.populate('user')
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: "user id not valid to delete blog"})
  }

})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  }

  const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updateBlog)
})

module.exports = blogsRouter