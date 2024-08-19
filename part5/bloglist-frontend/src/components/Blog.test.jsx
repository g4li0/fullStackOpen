import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

import { test } from 'vitest'
import { expect } from 'vitest'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'https://testing-library.com/',
  likes: 5,
  user: {
    name: 'Test User'
  }
}

test('only render blog title and author', () => {
  const { container } = render(<Blog blog={blog} />)
  //screen.debug()
  expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeDefined()
  const div = container.querySelector('.hiddenInfo')
  expect(div).toHaveStyle('display: none')
})

test('clicking the button shows hidden information', async () => {
  const { container } = render(<Blog blog={blog} />)
  const button = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(button)
  const div = container.querySelector('.hiddenInfo')
  expect(div).not.toHaveStyle('display: none')
})

test('clicking the button calls event handler twice', async () => {

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler).toHaveBeenCalledTimes(2)
  //expect(mockHandler.mock.calls).toHaveLength(2)
})