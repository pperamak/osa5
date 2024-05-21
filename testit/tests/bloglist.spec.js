const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Bloglist', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginform=page.getByTestId('loginform')
    await expect(loginform).toBeVisible()
  })
})

describe('Login', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })
  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible() 
  })

  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')
    await expect(page.getByText('Wrong username or password')).toBeVisible()
  })
})

describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
    await loginWith(page, 'mluukkai', 'salainen')
  })

  test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'testBlog', 'tester', 'test.com')
    await expect(page.getByText('testBlog tester')).toBeVisible()
  })

  test('a blog can be liked', async ({ page })=>{
    await createBlog(page, 'toBeLiked', 'fan', 'fandom.com')
    await page.getByRole('button', { name: 'view' }).click()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('likes 1')).toBeVisible()
  })

  test('a blog can be removed', async ({ page })=>{
    await createBlog(page, 'toBeRemoved', 'fan', 'fandom.com')
    await page.getByRole('button', { name: 'view' }).click()
    page.on('dialog', async dialog => {await dialog.accept()})
    await page.getByRole('button', { name: 'remove' }).click() 
    await expect(page.getByText('toBeRemoved fan')).not.toBeVisible()
    })

  test('only a user who has added the blog can see the button remove', async ({ page, request })=>{
    await createBlog(page, 'testBlog', 'mluukkai', 'test.com')
    await page.getByRole('button', { name: 'logout' }).click()
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi Person',
        username: 'tper',
        password: 'typer'
      }
    })
    await loginWith(page, 'tper', 'typer')
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('remove')).not.toBeVisible()
  })

  test('multiple blogs are shown in order of the number of likes', async ({ page })=>{
    await createBlog(page , 'ekatesti', 'mluukkai', 'test.1')
    await page.getByText('ekatesti mluukkai').waitFor()
    await createBlog(page , 'tokatesti', 'mluukkai', 'test.2')
    await page.getByText('tokatesti mluukkai').waitFor()
    await page.getByText('ekatesti mluukkai').getByRole('button', { name: 'view' }).click()
    
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByRole('button', { name: 'hide' }).click()
    await page.getByText('tokatesti mluukkai').getByRole('button', { name: 'view' }).click()
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByText('likes 1').waitFor()
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByRole('button', { name: 'hide' }).click()
    const blogEntries=page.getByTestId('blog')
    await expect(blogEntries.first()).toContainText('tokatesti mluukkai')
    await expect(blogEntries.nth(1)).toContainText('ekatesti mluukkai')
  })
})
