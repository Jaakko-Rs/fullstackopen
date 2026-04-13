const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const singleBlogList = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 5,
    __v: 0
  }
]

const blogCatalog = [
  {
    _id: '1',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '2',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 5,
    __v: 0
  },
  {
    _id: '3',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 12,
    __v: 0
  },
  {
    _id: '4',
    title: 'Refactoring',
    author: 'Robert C. Martin',
    url: 'http://example.com',
    likes: 10,
    __v: 0
  },
  {
    _id: '5',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'http://example.com',
    likes: 11,
    __v: 0
  },
  {
    _id: '6',
    title: 'Agile Software Development',
    author: 'Robert C. Martin',
    url: 'http://example.com',
    likes: 9,
    __v: 0
  }
]

describe('dummy', () => {
  test('always returns one', () => {
    const result = listHelper.dummy([])
    assert.strictEqual(result, 1)
  })
})
describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(singleBlogList)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogCatalog)
    assert.strictEqual(result, 54)
  })
})
describe('favorite blog', () => {
  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogCatalog)
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
  test('returns null for an empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})
describe('most blogs', () => {
  test('returns author with highest blog count', () => {
    const result = listHelper.mostBlogs(blogCatalog)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
  test('returns null for an empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})
describe('most likes', () => {
  test('returns author whose blogs have most total likes', () => {
    const result = listHelper.mostLikes(blogCatalog)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      likes: 30
    })
  })
  test('returns null for an empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
})