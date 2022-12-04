import { test, expect, Page } from '@playwright/test'
import { dbayLogin } from './helper'
require('dotenv').config()

const baseUrl = 'http://127.0.0.1:8080'

const itemName1 = 'My awesome item 1'
const itemPrice1 = '20'
const itemDescription1 = 'This is the first awesome item uploaded to DBay!'

let testUsername = ''
let testPasswd = ''

test.beforeAll(async () => {
    testUsername = process.env.TESTUSERNAME!
    testPasswd = process.env.TESTPASSWD!
    console.log(`${testUsername} ${testPasswd}`)
})

test('home page title test', async ({ page }) => {
    await page.goto(baseUrl)
    await expect(page).toHaveTitle(/DBay/)
})

test('user login and profile test', async ({ page }) => {

    await dbayLogin(page)

    await page.locator('#profile-button').click()
    await expect(page.locator('#banner')).toHaveText(new RegExp(`(${testUsername})`))
    await page.locator('#update-profile').click()

    await page.fill('#firstname-field', 'MyFirstname')
    await page.fill('#lastname-field', 'MyLastname')
    await page.fill('#phone-field', '1112223333')
    await page.fill('#address-field', 'Durham, NC 27708')

    await page.locator('#submit-button').click()
    await page.locator('#profile-button').click()

    await expect(page.locator('#banner')).toHaveText(`MyFirstname MyLastname (${testUsername})`)
    await expect(page.locator('#user-phone')).toHaveText('Phone number: 1112223333')
    await expect(page.locator('#user-address')).toHaveText('Address: Durham, NC 27708')
})

test('create item test', async ({ page }) => {
    await dbayLogin(page)

    await page.locator('#nav-create-item').click()



    await page.fill('#itemname-field', itemName1)
    await page.fill('#price-field', itemPrice1)
    await page.fill('#description-field', itemDescription1)

    await page.click('#submit-button')

    await expect(page.locator('#banner')).toHaveText(itemName1)
    await expect(page.locator('#item-seller')).toHaveText(`Seller: ${process.env.TESTUSERNAME!}`)
    await expect(page.locator('#item-description')).toHaveText(itemDescription1)
})


test('search item test', async ({ page }) => {
    await dbayLogin(page)

    await page.locator('#nav-search').click()

    await page.fill('#search-keyword-field', 'No item will be named like this')
    await page.locator('#search-button').click()

    await expect(page.locator('#search-results')).toHaveText('No items found')

    await page.fill('#search-keyword-field', itemName1)
    await page.locator('#search-button').click()

    await expect(page.locator('#search-results')).toHaveText(new RegExp(`${itemName1}`))
})

test('remove item test', async ({ page }) => {
    await dbayLogin(page)

    await page.locator('#profile-button').click()
    await page.locator('#user-items').click()

    let itemsCount = await page.locator('.card').count()

    let cardElement = page.locator(`.card:has(div.card-content:has-text("Seller: ${testUsername}"))`).first()
    await cardElement.locator('a').nth(1).click()
    await page.locator('button:has-text("Update Item")').click()
    await page.locator('#delete-attempt').click()

    await expect(page.locator(".message-header")).toHaveText('Do you really wish to delete the item?')
    await page.locator('#delete-confirm').click()

    await page.locator('#profile-button').click()
    await page.locator('#user-items').click()

    await expect(page.locator('#search-results')).toHaveText('No items found')
})
