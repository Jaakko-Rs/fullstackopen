const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'HTML is easy',
        author: 'Matti Luukkainen',
        url: 'https://fullstackopen.com',
        likes: 12
    },
    {
        title: 'Browser can execute only JavaScript',
        author: 'Edsger W. Dijkstra',
        url: 'https://example.com',
        likes: 7
    }
]
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
module.exports = {
    initialBlogs,
    blogsInDb
}