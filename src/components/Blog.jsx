import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggle = () => (
    <button onClick={() => {setShowDetails(!showDetails)}}>{ showDetails ? 'hide' : 'view' }</button>
  )

  const deleteButton = () => {
    if (deleteBlog) return <button className='destructive' onClick={deleteBlog}>delete</button>
    return <></>
  }

  return (
    <div className='blog' data-testid='blog' >
      {blog.title} {blog.author} {toggle()}
      {showDetails ?
        (
          <>
            <p className='blog-detail'>{blog.url}</p>
            <p className='blog-detail'>likes: {blog.likes} <button onClick={likeBlog}>like</button></p>
            <p className='blog-detail'>{blog.user.username}</p>
            {deleteButton()}
          </>
        ) : <></>
      }
    </div>
  )
}

export default Blog