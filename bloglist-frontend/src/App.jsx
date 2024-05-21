import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import AddBlogForm from './components/AddBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername]=useState('')
  const [password, setPassword]=useState('')
  const [user, setUser]=useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
  const [redMsg, setRedMsg]=useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(`${username} logged in succesfully!`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setRedMsg('Wrong username or password')
      setTimeout(() => {
        setRedMsg(null)
      }, 5000)
    }
  }

  const handleLogout=() => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    setErrorMessage('logged out')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleNewBlog=async (newBlog) => {

    try{

      blogService.setToken(user.token)
      const nblog=await blogService.create(newBlog)

      const newblogs=blogs.concat(nblog)
      setBlogs(newblogs)

      setErrorMessage(`a new blog ${nblog.title} by ${nblog.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }catch (exception){
      setRedMsg('Add all necessary information')
      setTimeout(() => {
        setRedMsg(null)
      }, 5000)
    }

  }



  const handleLikeUd= async (updatedBlog) => {
    const udBlog=await blogService.update(updatedBlog)
    const newblogs=blogs.map(blog => blog.id===udBlog.id ? udBlog : blog)
    setBlogs(newblogs)
  }

  const handleRemove=async(blogToRemove) => {
    blogService.setToken(user.token)
    await blogService.remove(blogToRemove)
    const blogsAfter=blogs.filter(blog => blog.id!==blogToRemove.id)
    setBlogs(blogsAfter)
  }



  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} redMsg={redMsg}/>
        <form onSubmit={handleLogin} data-testid='loginform'>
          <div>
            username
            <input
              data-testid='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div>
        <h2>blogs</h2>
        <Notification message={errorMessage} redMsg={redMsg}/>
        <p>{user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} handleLikeUd={handleLikeUd} handleRemove={handleRemove} user={user}/>
        )}
      </div>
      <div>
        <AddBlogForm handleNewBlog={handleNewBlog}/>
      </div>
    </div>
  )
}

export default App