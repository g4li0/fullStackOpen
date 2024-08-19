import { useState } from 'react'

const Blog = ({ blog ,updateBlog ,deleteBlog, currentUser }) => {

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
      <div style={visibility} className='hiddenInfo'>
        <span>{blog.url} <br /></span>
        <span>{blog.likes} <button className='likeButton' onClick={updateLikes}>like</button> <br /></span>
        <span>{blog.user.name} <br /></span>
        <span>{blog.user.username===currentUser && <button onClick={remove}>remove</button>}</span>
      </div>
    </div>
  )

}

export default Blog