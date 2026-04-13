const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({
        username: 'jaakko',
        name: 'Jaakko',
        passwordHash
    })
    await user.save()
    await Blog.insertMany(helper.initialBlogs)
})

const loginAndGetToken = async () => {
    const response = await api
        .post('/api/login')
        .send({
            username: 'jaakko',
            password: 'salasana'
        })

    return response.body.token
}

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})
test('the unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert(blog.id)
  assert.strictEqual(blog._id, undefined)
})
after(async () => {
  await mongoose.connection.close()
})

test('a valid blog can be added with a valid token', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
        title: 'token based blog creation',
        author: 'Jaakko',
        url: 'https://example.com/token-blog',
        likes: 8
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('token based blog creation'))
})

test('adding a blog fails with status code 401 if token is not provided', async () => {
    const newBlog = {
        title: 'blog without token',
        author: 'Jaakko',
        url: 'https://example.com/no-token',
        likes: 1
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('if likes property is missing, it defaults to 0', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
        title: 'Blog without likes',
        author: 'Jaakko',
        url: 'https://example.com/no-likes'
    }
    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})
test('blog without title is not added', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
        author: 'Jaakko',
        url: 'https://example.com/no-title',
        likes: 4
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
        title: 'Missing URL',
        author: 'Jaakko',
        likes: 4
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})
test('a blog can be deleted by its creator', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
        title: 'blog to delete',
        author: 'Jaakko',
        url: 'https://example.com/blog-to-delete',
        likes: 3
    }

    const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(blog => blog.id)
    assert(!ids.includes(createdBlog.body.id))
})
test('a blog likes count can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 10
    }
    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
})