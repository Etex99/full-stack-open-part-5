import { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmitForm = (event) => {
    event.preventDefault()
    createBlog(title, author, url)

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h1>Create new blog</h1>
      <form onSubmit={handleSubmitForm}>
        <div>
          title
          <input
            type="text"
            placeholder='enter blog title'
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            placeholder='enter blog author'
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            placeholder='enter blog url'
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button data-testid='create-blog' type='submit'>create</button>
      </form>
    </div>
  )
}

export default NewBlogForm