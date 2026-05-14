import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import BlogDetails from './components/BlogDetails'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import { Page } from './styles/Styled'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedInUser)
      )
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      setUsername('')
      setPassword('')
      showNotification(`welcome ${loggedInUser.name}`, 'success')
    } catch {
      showNotification('wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }
  const createBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'success'
      )
    } catch {
      showNotification('blog creation failed', 'error')
    }
  }
  const handleLike = async blog => {
    try {
      const blogToUpdate = {
        user:
            typeof blog.user === 'object' && blog.user !== null
              ? blog.user.id || blog.user._id
              : blog.user,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }

      const returnedBlog = await blogService.update(blog.id, blogToUpdate)
      const updatedBlog = {
        ...returnedBlog,
        user:
            typeof returnedBlog.user === 'object' && returnedBlog.user !== null
              ? returnedBlog.user
              : blog.user
      }
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
    } catch {
      showNotification('updating likes failed', 'error')
    }
  }
  const handleQuickLike = async blog => {
    await handleLike(blog)
  }
  const handleRemove = async blog => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      showNotification(`removed blog ${blog.title}`, 'success')
    } catch {
      showNotification('deleting blog failed', 'error')
    }
  }
  const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Page>
      <Navigation user={user} handleLogout={handleLogout} />
      <Notification notification={notification} />
      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogsToShow}
              user={user}
              onQuickLike={handleQuickLike}
            />
          }
        />
        <Route
          path="/login"
          element={
            user
              ? <Navigate replace to="/" />
              : (
                <LoginForm
                  username={username}
                  password={password}
                  handleUsernameChange={({ target }) => setUsername(target.value)}
                  handlePasswordChange={({ target }) => setPassword(target.value)}
                  handleSubmit={handleLogin}
                />
              )
          }
        />
        <Route
          path="/create"
          element={
            user
              ? <BlogForm createBlog={createBlog} />
              : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              blogs={blogsToShow}
              user={user}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          }
        />
      </Routes>
    </Page>
  )
}

export default App