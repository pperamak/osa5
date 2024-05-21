import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import AddBlogForm from './AddBlogForm'
import { expect } from 'vitest'

test('renders content', () => {
    const blog = {
      title: 'This is a test blog'    
    }
render(<Blog blog={blog}/>)
const element = screen.getByText('This is a test blog')
  expect(element).toBeDefined()
})

test('shows all content when view is clicked', async ()=>{
    const blog={
        title: 'Another test blog',
        likes: 69,
        user: {
            name: 'Tester'
        }
    }
    const kayttaja={
        username: 'Tester'
    }
    const { container } =render(<Blog blog={blog} user={kayttaja}/>)
    const user=userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const title = container.querySelector('#title')
    expect(title).toBeDefined()
    const url = container.querySelector('#url')
    expect(url).toBeDefined()
    const likes = container.querySelector('#likes')
    expect(likes).toBeDefined()
    const name = container.querySelector('#user')
    expect(name).toBeDefined()
})

test('clicking the like button twice calls event handler two times', async ()=>{
    const blog={
        title: 'Another test blog',
        likes: 69,
        user: {
            name: 'Tester'
        }
    }
    const kayttaja={
        username: 'Tester'
    }
    const mockHandler = vi.fn()
    const { container } =render(<Blog blog={blog} user={kayttaja} handleLikeUd={mockHandler}/>)
    const user=userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const likeButton=screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)

})

test('addblog form calls the callback function with right details', async ()=>{
    const user=userEvent.setup()
    const addBlog=vi.fn()
    const { container }=render(<AddBlogForm handleNewBlog={addBlog}/>)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const submit=container.querySelector('#submit-button')

    await user.type(titleInput, 'testTitle')
    await user.type(authorInput, 'testAuthor')
    await user.type(urlInput, 'testURL')
    await user.click(submit)

    expect(addBlog.mock.calls[0][0].title).toBe('testTitle')
    expect(addBlog.mock.calls[0][0].author).toBe('testAuthor')
    expect(addBlog.mock.calls[0][0].url).toBe('testURL')
})