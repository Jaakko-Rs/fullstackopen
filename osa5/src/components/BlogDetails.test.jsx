import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import BlogDetails from './BlogDetails'

const blog = {
  id: 'blog123',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  user: {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    id: 'user123'
  }
}

const renderWithRouter = (user) => {
  return render(
    <MemoryRouter initialEntries={['/blogs/blog123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              blogs={[blog]}
              user={user}
              handleLike={() => {}}
              handleRemove={() => {}}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

test('logged out user sees blog data but no buttons', () => {
  renderWithRouter(null)
  expect(screen.getByText('React patterns Michael Chan')).toBeDefined()
  expect(screen.getByText('https://reactpatterns.com/')).toBeDefined()
  expect(screen.getByText('likes 7')).toBeDefined()
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('logged in non-creator sees only like button', () => {
  renderWithRouter({
    id: 'someone-else',
    username: 'other',
    name: 'Other User'
  })
  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('creator sees both like and remove buttons', () => {
  renderWithRouter({
    id: 'user123',
    username: 'mluukkai',
    name: 'Matti Luukkainen'
  })
  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})