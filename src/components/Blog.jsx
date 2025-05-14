import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)
  
  const toggle = () => (
    <button onClick={() => {setShowDetails(!showDetails)}}>{ showDetails ? 'hide' : 'view' }</button>
  )

  return (
  <div className='blog'>
    {blog.title} {blog.author} {toggle()}
    {showDetails ?
    (
      <>
        <p className='blog-detail'>{blog.url}</p>
        <p className='blog-detail'>likes: {blog.likes} <button>like</button></p>
        <p className='blog-detail'>{blog.user.username}</p>
      </>
    ) : <></>
    }
  </div>
  )  
}

export default Blog