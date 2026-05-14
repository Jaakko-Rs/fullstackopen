import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls createBlog with right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} />
    </MemoryRouter>
  )
  const titleInput = screen.getByTestId('title')
  const authorInput = screen.getByTestId('author')
  const urlInput = screen.getByTestId('url')
  const createButton = screen.getByRole('button', { name: 'create' })
  await user.type(titleInput, 'Testing React forms')
  await user.type(authorInput, 'Tester')
  await user.type(urlInput, 'https://example.com/test')
  await user.click(createButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing React forms')
  expect(createBlog.mock.calls[0][0].author).toBe('Tester')
  expect(createBlog.mock.calls[0][0].url).toBe('https://example.com/test')
})