import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, expect } from 'vitest'

const blog = {
  id: '123456789012345678901234',
  title: 'example title',
  author: 'example author',
  url: 'example url',
  likes: 1,
  user: { username: 'example username', name: 'example name' }
}

describe('<Blog />', () => {
  let container
  let mockLikeHandler
  let mockDeleteHandler
  const user = userEvent.setup()

  beforeEach(() => {
    mockLikeHandler = vi.fn()
    mockDeleteHandler = vi.fn()
    container = render(<Blog blog={blog} likeBlog={mockLikeHandler} deleteBlog={mockDeleteHandler}/>)
  })

  test('initially renders title and author and not url, likes and username', async () => {
    
    // Find element using data attributes
    const parent = screen.getByTestId('blog')
    expect(parent).toBeDefined()
  
    // OR using CSS selectors:
    // const div = container.querySelector('.blog')
    // expect(div).toHaveTextContent(/example title/)
  
    // OR using other find methods of screen:
    // const element = screen.getByText('example title', { exact: false })
    // expect(element).toBeDefined()

    expect(screen.getByText(blog.title, { exact: false })).toBeDefined()
    expect(screen.getByText(blog.author, { exact: false })).toBeDefined()
    
    const url = screen.queryByText(blog.url, { exact: false })
    const likes = screen.queryByText(`likes: ${blog.likes}`, { exact: false })
    const username = screen.queryByText(blog.user.username, { exact: false })

    expect(url).toBeNull
    expect(likes).toBeNull
    expect(username).toBeNull
  })

  test('Clicking show reveals blog url, likes and username', async () => {
    await user.click(screen.getByText('view'))

    expect(screen.getByText(blog.url, { exact: false })).toBeDefined()
    expect(screen.getByText(`likes: ${blog.likes}`, { exact: false })).toBeDefined()
    expect(screen.getByText(blog.user.username, { exact: false })).toBeDefined()
  })

  test('clicking like twice causes its event handler to be called twice', async () => {
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
  
  test('clicking like or delete calls their respecitive event handlers once', async () => {
  
    // user expands blog view first to find more information and like/delete buttons
    await user.click(screen.getByText('view'))

    await user.click(screen.getByText('like'))
    await user.click(screen.getByText('delete'))
  
    expect(mockLikeHandler.mock.calls).toHaveLength(1)
    expect(mockDeleteHandler.mock.calls).toHaveLength(1)
  })
})
