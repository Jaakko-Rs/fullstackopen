const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const favorite = blogs.reduce((bestBlog, currentBlog) => {
    return currentBlog.likes > bestBlog.likes ? currentBlog : bestBlog
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorBlogCounts = {}

  blogs.forEach((blog) => {
    authorBlogCounts[blog.author] = (authorBlogCounts[blog.author] || 0) + 1
  })

  let topAuthor = null
  let maxBlogs = 0

  for (const author in authorBlogCounts) {
    if (authorBlogCounts[author] > maxBlogs) {
      maxBlogs = authorBlogCounts[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikeTotals = {}
  blogs.forEach((blog) => {
    authorLikeTotals[blog.author] = (authorLikeTotals[blog.author] || 0) + blog.likes
  })

  let topAuthor = null
  let maxLikes = 0

  for (const author in authorLikeTotals) {
    if (authorLikeTotals[author] > maxLikes) {
      maxLikes = authorLikeTotals[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}