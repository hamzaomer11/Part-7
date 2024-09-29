var lodash = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (array) => {

    const reducer = (sum, item) => {
        console.log(item, 'items data type: ')
        return sum + item.likes
    }
      
    return array.reduce(reducer, 0)
    
}

const favouriteBlog = (array) => {
    const max = array.reduce((previous, current) => (previous.likes > current.likes) 
    ? previous 
    : current)
    return max
}

const mostBlog = (array) => {
    const mostBlogs = array.reduce((previous, current) => (previous.blogs > current.blogs) 
    ? previous 
    : current)
    const drop = lodash.pick(mostBlogs, ['author', 'blogs'])
    return drop
}

const mostLikes = (array) => {
    const max = array.reduce((previous, current) => (previous.likes > current.likes) 
    ? previous 
    : current)
    const drop = lodash.pick(max, ['author', 'likes'])
    return drop
}
  
module.exports = {
   dummy,
   totalLikes,
   favouriteBlog,
   mostBlog,
   mostLikes
}