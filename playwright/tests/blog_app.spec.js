const { test, expect, describe, beforeEach } = require('@playwright/test')
const helper = require('./test_helper')

const blog = {
  title: 'test title',
  author: 'test author',
  url: 'test url',
  likes: 0
}

describe('Blogs App', () => {

  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Playwright User',
        username: 'playwright',
        password: 'secret'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Playwright User2',
        username: 'playwright2',
        password: 'secret'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    
    test('succeeds with correct credentials', async ({ page }) => {
      await helper.loginWith(page, 'playwright', 'secret')
      await page.getByText('Playwright User logged-in').waitFor()

      await expect(page.getByText('Playwright User logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await helper.loginWith(page, 'playwright', 'wrong')
      await page.locator('.error').waitFor()

      await expect(page.getByText('Wrong credentials')).toBeVisible()

    })
  })

  describe('When logged in', () => {
    
    beforeEach(async ({ page }) => {
      await helper.loginWith(page, 'playwright', 'secret')
      await page.getByText('Playwright User logged-in').waitFor()
    })

    test('can log out', async ({ page }) => {
      const logout = page.getByRole('button', { name: 'logout' })
      await expect(logout).toBeVisible()

      await logout.click()
      await expect(page.getByText('Log in to application')).toBeVisible()
      await expect(page.getByText('Playwright User logged-in')).not.toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await helper.createBlog(page, blog.title, blog.author, blog.url)

      const blogDiv = page.getByTestId('blog')
      expect(blogDiv).toBeVisible()

      expect(blogDiv.getByText(`${blog.title} ${blog.author}`)).toBeVisible()

      await (blogDiv.getByRole('button', { name: 'view' })).click()

      expect(blogDiv.getByText(blog.url)).toBeVisible()
      expect(blogDiv.getByText('likes: 0')).toBeVisible()
      expect(blogDiv.getByText('playwright')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await helper.createBlog(page, blog.title, blog.author, blog.url)

      const blogDiv = page.getByTestId('blog')
      await (blogDiv.getByRole('button', { name: 'view' })).click()

      await (blogDiv.getByRole('button', { name: 'like' })).click()
      await page.getByTestId('notification').waitFor()
      await blogDiv.getByText('likes: 1').waitFor()

      expect(blogDiv.getByText('likes: 1')).toBeVisible()
      
    })
    
    test('can delete own blog', async ({ page }) => {
      await helper.createBlog(page, blog.title, blog.author, blog.url)
      
      const blogDiv = page.getByTestId('blog')
      await (blogDiv.getByRole('button', { name: 'view' })).click()

      page.on('dialog', dialog => dialog.accept());
      await (blogDiv.getByRole('button', { name: 'delete' })).click()
      await page.getByTestId('notification').waitFor()

      const success = page.locator('.success')
      await expect(success).toBeVisible()
      await expect(success).toHaveText(`Deleted blog: "${blog.title}"`)
    })

    test('only creator of a blog sees the delete button', async ({ page }) => {
      await helper.createBlog(page, blog.title, blog.author, blog.url)

      let blogDiv = page.getByTestId('blog')
      await (blogDiv.getByRole('button', { name: 'view' })).click()
      await expect(blogDiv.getByText('delete')).toBeVisible()

      const logout = page.getByRole('button', { name: 'logout' })
      await logout.click()

      helper.loginWith(page, 'playwright2', 'secret')
      await page.getByText('Playwright User2 logged-in').waitFor()

      blogDiv = page.getByTestId('blog')
      await (blogDiv.getByRole('button', { name: 'view' })).click()
      await expect(blogDiv.getByText('delete')).not.toBeVisible()
    })
  })

})