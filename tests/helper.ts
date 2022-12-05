import {Page} from '@playwright/test'
require('dotenv').config()

const baseUrl = 'http://127.0.0.1:8080'

export async function dbayLogin(page: Page) {
  await page.goto(baseUrl)
  await page.locator('#nav-login').click()

  await page.fill('#username', process.env.TESTUSERNAME!)
  await page.fill('#password', process.env.TESTPASSWD!)

  await page.locator('#kc-login').click()
}
