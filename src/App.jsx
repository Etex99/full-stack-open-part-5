import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  const newBlogFormRef = useRef()
  const newBlogForm = () => (
    <Togglable showLabel='new blog' hideLabel='cancel' ref={newBlogFormRef}>
      <NewBlogForm createBlog={createBlog} />
    </Togglable>
  )

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  /* handlers */
  const login = async (credentials) => {
    console.log('logging in with', credentials.username, credentials.password)

    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      
    } catch (error) {
      notify('Wrong credentials', 'error', 5000)
    }
  }
  const createBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)
      let newBlogs = blogs
      newBlogs.push(addedBlog)
      setBlogs(newBlogs)
      notify(`A new blog "${addedBlog.title}" by ${addedBlog.author} was added.`, 'success', 5000)
      newBlogFormRef.current.toggleVisibility()
    } catch (error) {
      notify(error.response.data.error, 'error', 5000)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  /* helpers */
  const notify = (message, type, timeout) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), timeout)
  }
  const blogComponents = () => {
    return blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <h2>Blogs App</h2>

      {!user ?
        (
          <LoginForm login={login} />
        ) :
        (
          <>
            <p>{user.username} logged-in <button onClick={handleLogout}>logout</button></p>
            {newBlogForm()}
            <h3>Posts</h3>
            {blogComponents()}
          </>
        )
      }
    </div>
  )
}

export default App