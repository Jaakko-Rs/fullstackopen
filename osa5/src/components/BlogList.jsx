import { Card, BlogTitleLink, MutedText, SecondaryButton } from '../styles/Styled'

const BlogList = ({ blogs, onQuickLike, user }) => {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog => (
        <Card key={blog.id} className="blog">
          <div>
            <BlogTitleLink to={`/blogs/${blog.id}`}>
              {blog.title}
            </BlogTitleLink>{' '}
            <span>{blog.author}</span>
          </div>

          <MutedText>likes {blog.likes}</MutedText>
          {user && (
            <SecondaryButton onClick={() => onQuickLike(blog)}>
                            like
            </SecondaryButton>
          )}
        </Card>
      ))}
    </div>
  )
}
export default BlogList