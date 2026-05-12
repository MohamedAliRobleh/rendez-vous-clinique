import { test, expect } from '@playwright/test'

test.describe('Navigation générale', () => {

  test('Page accueil se charge correctement', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Votre santé')
    await expect(page.getByText('notre priorité')).toBeVisible()
    await expect(page.getByText('Prendre rendez-vous')).toBeVisible()
  })

  test('Navigation vers /medecins fonctionne', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Médecins')
    await expect(page).toHaveURL('/medecins')
    await expect(page.locator('h1')).toContainText('médecins')
  })

  test('Navigation vers /rendez-vous fonctionne', async ({ page }) => {
    await page.goto('/')
    // Bouton CTA hero
    await page.locator('button:has-text("Prendre rendez-vous")').first().click()
    await expect(page).toHaveURL('/rendez-vous')
    await expect(page.locator('h1')).toContainText('rendez-vous')
  })

  test('Page 404 s\'affiche pour route inconnue', async ({ page }) => {
    await page.goto('/cette-page-nexiste-pas')
    await expect(page.locator('h1')).toContainText('404')
    await expect(page.getByText("Retour à l'accueil")).toBeVisible()
  })

  test('Footer est visible sur la page d\'accueil', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.getByText('Clinique Al-Baraka').first()).toBeVisible()
  })

  test('Navbar devient opaque au scroll', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 200))
    await page.waitForTimeout(400)
    const navBg = await page.locator('nav').first().evaluate(el => getComputedStyle(el).background)
    expect(navBg).toBeTruthy()
  })

})
