import { useState } from "react"

const Blog = ({ blog ,updateBlog }) => {

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

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <div style={visibility}>
        {blog.url} <br />
        {blog.likes} <button onClick={updateLikes}>like</button> <br />
        {blog.user.name} <br />
      </div>
    </div>
  )

}

export default Blog