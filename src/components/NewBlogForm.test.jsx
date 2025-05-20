import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'
import { expect } from 'vitest'

const blog = {
  title: 'example title',
  author: 'example author',
  url: 'example url'
}

describe('<NewBlogForm />', () => {

  let container
  const mockSubmitHandler = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    mockSubmitHandler.mockClear()
    container = render(<NewBlogForm createBlog={mockSubmitHandler} />)
  })

  test('the event handler received within the props is called with the right details when a blog is created', async () => {
    await user.type(screen.getByPlaceholderText('enter blog title'), blog.title)
    await user.type(screen.getByPlaceholderText('enter blog author'), blog.author)
    await user.type(screen.getByPlaceholderText('enter blog url'), blog.url)
    
    await user.click(screen.getByTestId('create-blog'))

    expect(mockSubmitHandler.mock.calls).toHaveLength(1)
    expect(mockSubmitHandler.mock.calls[0][0]).toEqual(blog.title)
    expect(mockSubmitHandler.mock.calls[0][1]).toEqual(blog.author)
    expect(mockSubmitHandler.mock.calls[0][2]).toEqual(blog.url)
  })
})