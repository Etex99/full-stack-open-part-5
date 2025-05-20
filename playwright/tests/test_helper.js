const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'Title' }).fill(title)
  await page.getByRole('textbox', { name: 'Author' }).fill(author)
  await page.getByRole('textbox', { name: 'Url' }).fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByTestId('notification').waitFor()
}

const likeBlogWithTitle = async (page, title, likesToGrant) => {
  const blogDiv = page.getByText(title)
  await (blogDiv.getByRole('button', { name: 'view' })).click()
  const likeButton = await blogDiv.getByRole('button', { name: 'like' })
  for (let index = 0; index < likesToGrant; index++) {
    await likeButton.click()
  }
}

export { loginWith, createBlog, likeBlogWithTitle }