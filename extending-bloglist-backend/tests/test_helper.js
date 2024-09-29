const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "ABC",
        author: "ABC",
        url: "http://www.abc.com",
        likes: 300
    },
    {
        title: "EFG",
        author: "EFG",
        url: "http://www.efg.com",
        likes: 500
    }
]

const initialUsers = [
    {
        "username": "rootUser",
        "name": "root",
        "password": "rootUser"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    blogsInDb,
    initialBlogs,
    usersInDb,
    initialUsers
}