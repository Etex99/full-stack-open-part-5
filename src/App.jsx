import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

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
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      
    } catch (error) {
      notify('Wrong credentials', 'error', 5000)
    }

    setUsername('')
    setPassword('')
  }
  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    try {
      const addedBlog = await blogService.create(newBlog)
      let newBlogs = blogs
      newBlogs.push(addedBlog)
      setBlogs(newBlogs)
      notify(`A new blog "${addedBlog.title}" by ${addedBlog.author} was added.`, 'success', 5000)
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

      {!user ?
        (
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        ) :
        (
          <>
            <NewBlogForm
              handleCreateBlog={handleCreateBlog}
              newBlogTitle={newBlogTitle}
              setNewBlogTitle={setNewBlogTitle}
              newBlogAuthor={newBlogAuthor}
              setNewBlogAuthor={setNewBlogAuthor}
              newBlogUrl={newBlogUrl}
              setNewBlogUrl={setNewBlogUrl}
            />
            <p>{user.username} logged-in <button onClick={handleLogout}>logout</button></p>
            <h2>Blogs</h2>
            {blogComponents()}
          </>
        )
      }
    </div>
  )
}

export default App