// hooks
import { useState, useEffect } from 'react'
// components
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
// services
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null });
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


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
      , 4000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
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
      //console.log(exception)
      setNotification({
        message: 'wrong credentials',
        type: 'error'
      })
      NotificationTimeOut()
    }
  }


  const loginForm = () => {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin} >
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
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

  const handleBlogForm = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      }
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

  const blogForm = () => {
    return (
      <div>
        <form onSubmit={handleBlogForm}>
          <div>
            title:
            <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <input type="submit" value="create" />

        </form>
      </div>
    )
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

  if (user === null) {
    return (
      loginForm()
    )
  }
  else {
    return (

      <div>
        <h2>blogs</h2>
        <Notification message={notification.message} type={notification.type} />
        <p>
          {user.name} logged in
          <input type="button" value="logout" onClick={logOut} />
        </p>
        <Togglable buttonLabel="new blog">
          {blogForm()}
        </Togglable>

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

}

export default App