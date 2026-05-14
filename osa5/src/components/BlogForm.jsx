import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  InputGroup,
  Label,
  Input,
  PlainButton
} from '../styles/Styled'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const addBlog = async event => {
    event.preventDefault()
    await createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>create new</h2>
      <Form onSubmit={addBlog}>
        <InputGroup>
          <Label htmlFor="title">title</Label>
          <Input
            id="title"
            data-testid="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="author">author</Label>
          <Input
            id="author"
            data-testid="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="url">url</Label>
          <Input
            id="url"
            data-testid="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </InputGroup>
        <PlainButton type="submit">create</PlainButton>
      </Form>
    </div>
  )
}
export default BlogForm