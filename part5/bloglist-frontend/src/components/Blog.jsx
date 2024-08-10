import { useState } from "react"

const Blog = ({ blog }) => {

  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const visibility = { display: visible ? '' : 'none' }
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <div style={visibility}>
        {blog.url} <br />
        {blog.likes} <button>like</button> <br />
        {blog.user.name} <br />
      </div>
    </div>
  )

}

export default Blog