const { test, beforeEach} = require('node:test')
const assert = require("node:assert");
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token;

beforeEach(async () => {

    await Blog.deleteMany({})
    await User.deleteMany({})
    
    const newUser = {
    username: "rootUser",
    password: "rootUser",
    }

    await api
    .post("/api/users")
    .send(newUser)

    await Blog.insertMany(helper.initialBlogs)

    const result = await api
    .post("/api/login")
    .send(newUser)

    token = result.body.token

    const newTestBlog = {
        title: "HIJ",
        author: "HIJ",
        url: "http://www.hij.com",
        likes: 300
    }

    await api
    .post("/api/blogs")
    .set('Authorization', `Bearer ${token}`)
    .send(newTestBlog)
})

test.only('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1) /** Modified for Exercise 4.23 */
})
  
test.only('the first blog is about ABC', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(e => e.title)
    assert(contents.includes('ABC'))
})

test.only('the unique id property of the blog posts is named id', async () => {
   const blogs = await helper.blogsInDb()
   blogs.forEach((blog) => {
    assert.notStrictEqual(blog.id, undefined);
   });
})

test.only('a valid blog can be added ', async () => {
    const newBlog = {
        title: "HIJ",
        author: "HIJ",
        url: "http://www.hij.com",
        likes: 200
    }

    /** Exercise 4.23 - Start*/
    
    const response = await api
      .post('/api/login')
      .send({username: helper.initialUsers[0].username, password: helper.initialUsers[0].password})
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.token

    /** Exercise 4.23 - End*/

    
    /** making an HTTP POST request to the /api/blogs URL successfully creates a new blog post */
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    /** verifying that the total number of blogs in the system is increased by one */
    const blogAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 2) /** Modified for Exercise 4.23 */
    
    /** verifying that the content of the blog post is saved correctly to the database */
    const titles = blogAtEnd.map(b => b.title)
    assert(titles.includes('HIJ'))
})

test.only('like property defaults to 0 if missing', async () => {
    const newBlog = {
        title: "HIJ",
        author: "HIJ",
        url: "http://www.hij.com",
      }
    
    /** Exercise 4.23 - Start*/
    
        const response = await api
        .post('/api/login')
        .send({username: helper.initialUsers[0].username, password: helper.initialUsers[0].password})
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const token = response.body.token

    /** Exercise 4.23 - End*/

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogAtEnd = await helper.blogsInDb()
      const blogLikes = blogAtEnd.map(blog => blog.likes)
      assert(blogLikes.includes(0))
})

test.only('respond with 400 bad request if title/url properties are missing', async () => {
    const newBlog = {
        title: "",
        author: "KLM",
        url: "http://www.klm.com",
        likes: 100
    }
    
    /** Exercise 4.23 - Start*/
    
    const response = await api
    .post('/api/login')
    .send({username: helper.initialUsers[0].username, password: helper.initialUsers[0].password})
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const token = response.body.token

    /** Exercise 4.23 - End*/

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1) /** Modified for Exercise 4.23 */
})

test.only('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogtoDelete = blogsAtStart[2]

    await api
        .delete(`/api/blogs/${blogtoDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)

    const contents = blogAtEnd.map(blog => blog.title)
    assert(!contents.includes(blogtoDelete.title))
})

test.only('invalid user is not created', async () => {
    const newUser = {
        username: "",
        name: "KLM",
        password: ""
    }
        
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        
    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, helper.initialUsers.length)
})

test.only('respond with 400 status-code & error message if invalid user/password is added', async () => {
    const newUser = {
        username: "",
        name: "KLM",
        password: ""
    }
        
    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        
    assert(result.body.error.includes('invalid username or password'))
})

test.only('blog fails with status code 401 Unauthorized if no token provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogtoDelete = blogsAtStart[2]

    await api
        .delete(`/api/blogs/${blogtoDelete.id}`)
        .expect(401)

    const blogAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)
})