const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  const baseUrl = 'http://localhost:5173'
  beforeEach(async ({ page, request }) => {
    await request.post(`${baseUrl}/api/reset`)
    await request.post(`${baseUrl}/api/users`,{
      username: 'root',
      name: 'root',
      password: 'toor'
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

})