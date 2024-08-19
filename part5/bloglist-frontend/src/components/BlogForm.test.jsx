import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'

import { test } from 'vitest'
import { expect } from 'vitest'

test('create new blog calls event handler with correct data', async () => {
  const createBlog = vi.fn()
  render(<BlogForm createBlog={createBlog} />)
  const title = screen.getByPlaceholderText('title')
  const author = screen.getByPlaceholderText('author')
  const url = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')
  await userEvent.type(title, 'Test Title')
  await userEvent.type(author, 'Test Author')
  await userEvent.type(url, 'https://test.com/')
  await userEvent.click(createButton)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test Title',
    author: 'Test Author',
    url: 'https://test.com/'
  })
})