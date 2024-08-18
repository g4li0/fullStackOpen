const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const content = await page.locator('h2').all()
    const form = await page.locator('#loginForm')
    expect(content).toHaveLength(1)
    expect(content[0]).toHaveText('log in to application')
    expect(form).toBeVisible()
    expect(form.getByTestId('username')).not.toBeNull()
    expect(form.getByTestId('password')).not.toBeNull()
    expect(form.getByText('login')).toBeVisible()
    
  })
})