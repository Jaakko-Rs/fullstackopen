const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  test('login form is shown from navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'blogs' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.locator('nav')).toContainText('Matti Luukkainen logged in')
    })
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      await createBlog(
        page,
        'Playwright blog',
        'Test Author',
        'https://example.com'
      )
      await expect(page.getByRole('link', { name: 'Playwright blog' })).toBeVisible()
      await expect(page.getByText('Playwright blog Test Author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('link', { name: 'new blog' }).click()
        await createBlog(
          page,
          'Existing blog',
          'Existing author',
          'https://example.com/existing'
        )
      })

      test('it can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'Existing blog' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('the user who added the blog can delete it', async ({ page }) => {
        await page.getByRole('link', { name: 'Existing blog' }).click()
        page.once('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByRole('link', { name: 'Existing blog' })).not.toBeVisible()
      })

      test('only the user who added the blog sees the remove button', async ({ page, request }) => {
        await request.post('/api/users', {
          data: {
            name: 'Another User',
            username: 'another',
            password: 'salainen'
          }
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await expect(page.getByText('Log in to application')).toBeVisible()
        await loginWith(page, 'another', 'salainen')
        await page.getByRole('link', { name: 'Existing blog' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })
})