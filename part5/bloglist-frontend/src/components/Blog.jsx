import { useState } from 'react'

const Blog = ({ blog ,updateBlog ,deleteBlog }) => {

  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const visibility = { display: visible ? '' : 'none' }

  const updateLikes = () => {
    const newBlog = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    return updateBlog(blog.id, newBlog)
  }

  const remove = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <div style={visibility}>
        {blog.url} <br />
        {blog.likes} <button onClick={updateLikes}>like</button> <br />
        {blog.user.name} <br />
        <button onClick={remove}>remove</button>
      </div>
    </div>
  )

}

export default Blog