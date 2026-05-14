import { useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  PlainButton,
  SecondaryButton,
  MutedText
} from '../styles/Styled'

const BlogDetails = ({ blogs, user, handleLike, handleRemove }) => {
  const id = useParams().id
  const navigate = useNavigate()
  const blog = blogs.find(b => b.id === id)
  if (!blog) {
    return null
  }

  const creatorId =
        typeof blog.user === 'object' && blog.user !== null
          ? blog.user.id || blog.user._id
          : blog.user
  const loggedInUserId = user ? user.id || user._id : null
  const showRemoveButton = loggedInUserId && creatorId === loggedInUserId
  const removeBlog = async () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (!ok) {
      return
    }
    await handleRemove(blog)
    navigate('/')
  }

  return (
    <Card>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
                likes {blog.likes}
        {user && (
          <PlainButton onClick={() => handleLike(blog)}>
                        like
          </PlainButton>
        )}
      </div>
      <MutedText style={{ marginTop: '0.5rem' }}>
                added by {typeof blog.user === 'object' && blog.user !== null ? blog.user.name : ''}
      </MutedText>
      {showRemoveButton && (
        <div style={{ marginTop: '0.75rem' }}>
          <SecondaryButton onClick={removeBlog}>remove</SecondaryButton>
        </div>
      )}
    </Card>
  )
}

export default BlogDetails