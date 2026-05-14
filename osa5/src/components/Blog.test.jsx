import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      id: '12345'
    },
    id: 'blog123'
  }
  const currentUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    id: '12345'
  }

  test('renders title and author, but does not render url or likes by default', () => {
    render(
      <Blog
        blog={blog}
        user={currentUser}
        handleLike={() => {}}
        handleRemove={() => {}}
      />
    )

    expect(screen.getByText('React patterns Michael Chan')).toBeDefined()
    expect(screen.queryByText('https://reactpatterns.com/')).toBeNull()
    expect(screen.queryByText('likes 7')).toBeNull()
  })

  test('renders url, likes and user name after clicking the view button', async () => {
    const user = userEvent.setup()
    render(
      <Blog
        blog={blog}
        user={currentUser}
        handleLike={() => {}}
        handleRemove={() => {}}
      />
    )

    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('https://reactpatterns.com/')).toBeDefined()
    expect(screen.getByText('likes 7')).toBeDefined()
    expect(screen.getByText('Matti Luukkainen')).toBeDefined()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={currentUser}
        handleLike={mockHandler}
        handleRemove={() => {}}
      />
    )
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})