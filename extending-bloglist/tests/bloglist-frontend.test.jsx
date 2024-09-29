import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog'
import BlogForm from '../src/components/BlogForm'

test('renders title & author', () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: "1"
  }

  const { container } = render(<Blog blog={blog}/>)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'test title'
  )

  const div2 = container.querySelector('.blog')
  expect(div2).toHaveTextContent(
    'test author'
  )

  screen.debug()

})

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: "1"
  }
  
  const {container} = render(<Blog blog={blog}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.blog')
  
  expect(div).toHaveTextContent(
    '1'
  )

  expect(div).toHaveTextContent(
    'test url'
  )

  screen.debug()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: "1"
  }

  const mockHandler = vi.fn()
  
  render(<Blog blog={blog} updateBlog={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

  screen.debug()
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog}/>)

  const blogTitle = screen.getByPlaceholderText('write blog title here')
  const blogAuthor = screen.getByPlaceholderText('write blog author here')
  const blogUrl = screen.getByPlaceholderText('write blog url here')
  const sendButton = screen.getByText('create')

  await user.type(blogTitle, 'blog title 1')
  await user.type(blogAuthor, 'blog author 1')
  await user.type(blogUrl, 'blog url 1')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('blog title 1')
  expect(createBlog.mock.calls[0][0].author).toBe('blog author 1')
  expect(createBlog.mock.calls[0][0].url).toBe('blog url 1')
  console.log(createBlog.mock.calls)

  screen.debug()
})