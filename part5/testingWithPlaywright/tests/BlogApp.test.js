const { test, expect, beforeEach, describe, APIRequest } = require('@playwright/test')

describe('Blog app', () => {
  const baseUrl = 'http://localhost:5173'
  const login = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByText('login').click()
  }
  const defaultBlog = async (page) => {
    await page.getByText('new blog').click()
    await page.getByTestId('title').fill('title')
    await page.getByTestId('author').fill('author')
    await page.getByTestId('url').fill('url')
    await page.locator('form').locator('input[type="submit"]').click()
  }
  beforeEach(async ({ page, request }) => {
    await request.post(`${baseUrl}/api/testing/reset`)
    await request.post(`${baseUrl}/api/users`, {
      data: {
        username: 'root',
        name: 'root',
        password: 'toor'
      }
    })
    await request.post(`${baseUrl}/api/users`, {
      data: {
        username: 'toor',
        name: 'toor',
        password: 'root'
      }
    })
    await request.post(`${baseUrl}/api/login`, {
      data: {
        username: 'root',
        password: 'toor'
      }
    })
    await request.post(`${baseUrl}/api/login`, {
      data: {
        username: 'toor',
        password: 'root'
      }
    })

    await page.goto(baseUrl)
  })

  test('Login form is shown', async ({ page }) => {
    const content = await page.locator('h2').all()
    const form = await page.locator('#loginForm')
    await expect(content).toHaveLength(1)
    await expect(content[0]).toHaveText('log in to application')
    await expect(form).toBeVisible()
    await expect(form.getByTestId('username')).not.toBeNull()
    await expect(form.getByTestId('password')).not.toBeNull()
    await expect(form.getByText('login')).toBeVisible()
  })
  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('root')
      await page.getByTestId('password').fill('toor')
      await page.getByText('login').click()
      const notification = await page.locator('.success')
      await expect(notification).toBeVisible()
      await expect(notification).toContainText('you are logged in')

    })
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('root')
      await page.getByTestId('password').fill('root')
      await page.getByText('login').click()
      const notification = await page.locator('.error')
      await expect(notification).toBeVisible()
      await expect(notification).toContainText('wrong credentials')

    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'root', 'toor')
    })

    test('a new blog can be created', async ({ page }) => {
      await defaultBlog(page)
      await expect(page.locator('.success')).toContainText('a new blog title by author added')
      await expect(page.getByText('title author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await defaultBlog(page)
      await page.getByText('view').click()
      const likeButton = await page.getByText('like')
      const data = await page.locator('.hiddenInfo').textContent()
      const likes = await data.split(' ')[1]
      await expect(likeButton).toBeVisible()
      await likeButton.click()
      await expect(page.locator('.hiddenInfo')).not.toContainText(likes + 1)
    })
    test('a blog can be deleted', async ({ page }) => {
      await defaultBlog(page)
      await page.getByText('view').click()
      const info = await page.locator('.hiddenInfo')
      const removeButton = await info.getByText('remove')
      await expect(removeButton).toBeVisible()
      page.on('dialog', dialog => dialog.accept())
      await removeButton.click()
      await expect(page.locator('.success')).toContainText('blog deleted')
    })
    test('a blog cannot be deleted by another user', async ({ page }) => {
      await defaultBlog(page)
      await expect(page.locator('.success')).toContainText('a new blog title by author added')
      await page.getByText('logout').click()
      await expect(page.locator('.success')).toContainText('you are logged out')
      await login(page, 'toor', 'root')
      await expect(page.getByText('view')).toBeVisible()
      await page.getByText('view').click()
      const info = await page.locator('.hiddenInfo')
      const removeButton = await info.getByText('remove')
      await expect(removeButton).toBeHidden()
    })
  })

})