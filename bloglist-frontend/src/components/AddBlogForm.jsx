import { useState } from 'react'
import PropTypes from 'prop-types'

const AddBlogForm=({
  handleNewBlog
}) => {
  const [title, setTitle]=useState('')
  const [author, setAuthor]=useState('')
  const [url, setUrl]=useState('')
  const [newBlogVisible, setNewBlogVisible]=useState(false)
  const hideWhenVisible = { display: newBlogVisible ? 'none' : '' }
  const showWhenVisible = { display: newBlogVisible ? '' : 'none' }

  const addBlog = (event) => {
    event.preventDefault()
    handleNewBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
    setNewBlogVisible(false)
  }


  return(
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setNewBlogVisible(true)}>add new blog</button>
      </div>
      <div style={showWhenVisible}>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>
          title
            <input
              data-testid='title'
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
              id='title-input'
            />
          </div>
          <div>
          author
            <input
              data-testid='author'
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
              id='author-input'
            />
          </div>
          <div>
          url
            <input
              data-testid='url'
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
              id='url-input'
            />
          </div>
          <button type="submit" id='submit-button'>create</button>
        </form>
        <button onClick={() => setNewBlogVisible(false)}>cancel</button>
      </div>
    </div>
  )
}
AddBlogForm.propTypes={
  handleNewBlog: PropTypes.func.isRequired
}
export default AddBlogForm