const { test, expect, beforeEach, describe, APIRequest } = require('@playwright/test')

describe('Blog app', () => {
  const baseUrl = 'http://localhost:5173'
  const login = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByText('login').click()
  }
  const postBlog = async ( request, credentials , blog) => {
    const response = await request.post(`${baseUrl}/api/login`, {
      data: {
        username: credentials.username,
        password: credentials.password
      }
    })
    const token = (await response.json()).token

    await request.post(`${baseUrl}/api/blogs`, {
      data: {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes? blog.likes : 0,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    )
  }
  const addBlog = async (page, title, author, url) => {
    await page.locator('button').getByText('new blog').click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
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

    await page.goto(baseUrl)
  })

  test('Login form is shown', async ({ page }) => {
    const content = await page.locator('h2').all()
    const form = page.locator('#loginForm')
    await expect(content).toHaveLength(1)
    await expect(content[0]).toHaveText('log in to application')
    await expect(form).toBeVisible()
    await expect(form.getByTestId('username')).not.toBeNull()
    await expect(form.getByTestId('password')).not.toBeNull()
    await expect(form.getByText('login')).toBeVisible()
  })
  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'root', 'toor')
      const notification = await page.locator('.success')
      await expect(notification).toBeVisible()
      await expect(notification).toContainText('you are logged in')

    })
    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'root', 'root')
      const notification = page.locator('.error')
      await expect(notification).toBeVisible()
      await expect(notification).toContainText('wrong credentials')

    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'root', 'toor')
    })

    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'title', 'author', 'url')
      await expect(page.locator('.success')).toContainText('a new blog title by author added')
      await expect(page.getByText('title author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page, request }) => {
      //await addBlog(page, 'title', 'author', 'url')
      await postBlog(request, { username: 'root', password: 'toor' }, { title: 'title', author: 'author', url: 'url' })
      page.reload()
      await page.getByText('view').click()
      const likeButton = page.getByText('like')
      const data = await page.locator('.hiddenInfo').textContent()
      const likes = parseInt(data.split(' ')[1])
      await expect(likeButton).toBeVisible()
      await likeButton.click()
      await expect(page.locator('.hiddenInfo')).toContainText((likes+1).toString())
    })
    test('a blog can be deleted', async ({ page, request }) => {
      await postBlog(request, { username: 'root', password: 'toor' }, { title: 'title', author: 'author', url: 'url' })
      page.reload()
      await page.getByText('view').click()
      const blogDetails = page.locator('.hiddenInfo')
      const removeButton = blogDetails.getByText('remove')
      await expect(removeButton).toBeVisible()
      page.on('dialog', dialog => dialog.accept())
      await removeButton.click()
      await expect(page.locator('.success')).toContainText('blog deleted')
    })
    test('a blog cannot be deleted by another user', async ({ page, request }) => {
      await postBlog(request, { username: 'toor', password: 'root' }, { title: 'title', author: 'author', url: 'url' })
      await page.reload()
      await page.locator('button').getByText('view').click()
      const removeButton = page.locator('button').getByText('remove')
      await expect(removeButton).not.toBeVisible()
    })
    test('blogs are ordered by likes', async ({ page, request }) => {
      await postBlog(request, { username: 'root', password: 'toor' }, { title: 'title1', author: 'author1', url: 'url1', likes: 1 })
      await postBlog(request, { username: 'root', password: 'toor' }, { title: 'title2', author: 'author2', url: 'url2', likes: 2 })
      await postBlog(request, { username: 'root', password: 'toor' }, { title: 'title3', author: 'author3', url: 'url3', likes: 3 })
      page.reload()
      await expect(page.locator('.hiddenInfo').first()).toContainText('3')
      await expect(page.locator('.hiddenInfo').last()).toContainText('1')
    })

  })

})