// hooks
import { useState, useEffect, useRef } from 'react'
// components
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
// services
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const session = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
    if (session) {
      setUser(session)
      blogService.setToken(session.token)
    }
  }, [])

  const NotificationTimeOut = () => {
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }
    , 5000)
  }

  const handleLogin = async ({ username, password }) => {
    if(username === '' || password === '') {
      return
    }
    try {
      const user = await loginService.login({
        username: username,
        password: password
      })
      setUser(user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')

      setNotification({
        message: 'you are logged in',
        type: 'success'
      })
      NotificationTimeOut()
    } catch (exception) {
      console.log(exception)
      setNotification({
        message: 'wrong credentials',
        type: 'error'
      })
      NotificationTimeOut()
    }
  }

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
      setNotification({
        message: `a new blog ${response.title} by ${response.author} added`,
        type: 'success'
      })
      NotificationTimeOut()
    }
    catch (exception) {
      setNotification({
        message: `error creating blog: ${exception.response.data.error}`,
        type: 'error'
      })
      NotificationTimeOut()
    }

  }

  const handleLike = async (id, blog) => {
    try {
      const response = await blogService.update(id, blog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : response))
    }
    catch (exception) {
      setNotification({
        message: `error liking blog: ${exception.response.data.error}`,
        type: 'error'
      })
      NotificationTimeOut()
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await blogService.remove(id)
      console.log(response)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setNotification({
        message: 'blog deleted',
        type: 'success'
      })
      NotificationTimeOut()

    }
    catch (exception) {
      setNotification({
        message: `error deleting blog: ${exception.response.data.error}`,
        type: 'error'
      })
      NotificationTimeOut()
    }
  }

  const logOut = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    setNotification({
      message: 'you are logged out',
      type: 'success'
    })
    NotificationTimeOut()
  }

  const title = (user) => user
    ? 'blogs'
    : 'log in to application'

  const blogFormRef = useRef()

  return (
    <div>
      <h2>{title(user)}</h2>
      <Notification message={notification.message} type={notification.type} />
      {
        (!user &&
          <LoginForm handleLogin={handleLogin} />
        )
        ||
        (user &&
          <>
            <p>
              {user ? user.name : null} logged in
              <input type="button" value="logout" onClick={logOut} />
            </p>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>

            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} updateBlog={handleLike} deleteBlog={handleDelete} />
            )}
          </>
        )
      }
    </div>
  )

}

export default App