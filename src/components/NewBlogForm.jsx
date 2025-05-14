const NewBlogForm = ({ handleCreateBlog, newBlogTitle, setNewBlogTitle, newBlogAuthor, setNewBlogAuthor, newBlogUrl, setNewBlogUrl }) => {
  return (
    <div>
      <h1>Create new blog</h1>
      <form onSubmit={handleCreateBlog}>
        <div>
          title
          <input
            type="text"
            value={newBlogTitle}
            name="Title"
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={newBlogAuthor}
            name="Author"
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={newBlogUrl}
            name="Url"
            onChange={({ target }) => setNewBlogUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default NewBlogForm