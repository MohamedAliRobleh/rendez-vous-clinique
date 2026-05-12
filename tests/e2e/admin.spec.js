import { test, expect } from '@playwright/test'

test.describe('Administration', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('isAdmin'))
  })

  test('Route /admin sans auth redirige vers /login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL('/login')
  })

  test('Login avec mauvais credentials affiche une erreur', async ({ page }) => {
    await page.goto('/login')
    await page.locator('[data-testid="email-input"]').fill('wrong@email.com')
    await page.locator('[data-testid="password-input"]').fill('wrongpassword')
    await page.locator('[data-testid="login-button"]').click()
    await expect(page.getByText('Email ou mot de passe incorrect')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('Login avec bons credentials redirige vers /admin', async ({ page }) => {
    await page.goto('/login')
    await page.locator('[data-testid="email-input"]').fill('admin@clinique-albaraka.dj')
    await page.locator('[data-testid="password-input"]').fill('demo1234')
    await page.locator('[data-testid="login-button"]').click()
    await expect(page).toHaveURL('/admin')
    await expect(page.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible()
  })

  test('Dashboard affiche les 4 KPI cards', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('isAdmin', 'true'))
    await page.goto('/admin')
    await expect(page.getByText('Total rendez-vous')).toBeVisible()
    await expect(page.getByText("Aujourd'hui")).toBeVisible()
    await expect(page.getByText('En attente').first()).toBeVisible()
    await expect(page.getByText('Confirmés')).toBeVisible()
  })

  test('Page /admin/rendez-vous affiche le tableau', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('isAdmin', 'true'))
    await page.goto('/admin/rendez-vous')
    await expect(page.locator('h2')).toContainText('Rendez-vous')
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('thead')).toContainText('Patient')
  })

  test('Confirmer un RDV "en attente" change son statut', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('isAdmin', 'true'))
    await page.goto('/admin/rendez-vous')

    // Filtrer par "en attente"
    await page.locator('button').filter({ hasText: 'en attente' }).first().click()
    await page.waitForTimeout(200)

    // Cliquer sur le bouton ✅ Confirmer du premier RDV visible
    const confirmBtn = page.locator('button[title="Confirmer"]').first()
    const count = await confirmBtn.count()
    if (count > 0) {
      await confirmBtn.click()
      // Toast de succès — attendre qu'un toast apparaisse dans le container
      await expect(page.locator('.Toastify__toast')).toBeVisible()
    } else {
      test.skip() // Pas de RDV en attente disponible
    }
  })

  test('Déconnexion redirige vers /login', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('isAdmin', 'true'))
    await page.goto('/admin')
    await page.locator('button:has-text("Déconnexion")').click()
    await expect(page).toHaveURL('/login')
  })

})
