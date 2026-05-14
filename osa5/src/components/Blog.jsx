import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const creatorId =
        typeof blog.user === 'object' && blog.user !== null
          ? blog.user.id || blog.user._id
          : blog.user

  const loggedInUserId = user ? user.id || user._id : null
  const showRemoveButton = loggedInUserId && creatorId === loggedInUserId
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const removeBlog = () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      handleRemove(blog)
    }
  }
  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
                        likes {blog.likes}
            {user && <button onClick={() => handleLike(blog)}>like</button>}
          </div>
          <div>
            {typeof blog.user === 'object' && blog.user !== null
              ? blog.user.name
              : ''}
          </div>

          {showRemoveButton && (
            <button onClick={removeBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}
export default Blog