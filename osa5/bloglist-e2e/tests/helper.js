const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await expect(page.getByLabel('username')).toBeVisible()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const createBlogWithApi = async (request, token, blog) => {
  await request.post('http://localhost:3003/api/blogs', {
    data: blog,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const loginWithApi = async (request, username, password) => {
  const response = await request.post('http://localhost:3003/api/login', {
    data: { username, password }
  })

  return await response.json()
}

module.exports = {
  loginWith,
  createBlog,
  createBlogWithApi,
  loginWithApi
}