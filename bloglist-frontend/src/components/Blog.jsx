import { useState } from 'react'
const Blog = ({ blog, handleLikeUd, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView]=useState(false)
  const [likes, setLikes]=useState(blog.likes)


  const updateLikes=(event) => {
    event.preventDefault()
    const newLikes = likes + 1
    setLikes(newLikes)
    const uBlog={
      user: blog.user['id'],
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }
    handleLikeUd(uBlog)
  }

  const removeBlog=(event) => {
    event.preventDefault()
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      handleRemove(blog)
    }
  }
  return(
    <div data-testid='blog' style={blogStyle} id='title'>
      {blog.title} {blog.author}{view ?
        <button onClick={() => setView(false)}>hide</button>
        :
        <button onClick={() => setView(true)}>view</button>
      }
      {view && (
        <div>
          <div id='url'>
            {blog.url}
          </div>
          <div id='likes'>
          likes {likes}<button onClick={updateLikes}>like</button>
          </div>
          <div id='user'>
            {blog.user['name']}
          </div>
          {(user.username === blog.user['username']) && (
            <button onClick={removeBlog}>remove</button>
          )
          }
        </div>
      )}

    </div>
  )
}
export default Blog