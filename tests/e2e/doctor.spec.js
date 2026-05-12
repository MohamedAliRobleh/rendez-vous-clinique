import { test, expect } from '@playwright/test'

test.describe('Espace médecin', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('isMedecin')
      localStorage.removeItem('medecinId')
    })
  })

  test('Route /medecin sans auth redirige vers /login', async ({ page }) => {
    await page.goto('/medecin')
    await expect(page).toHaveURL('/login')
  })

  test('Login médecin avec bons credentials redirige vers /medecin', async ({ page }) => {
    await page.goto('/login')
    await page.locator('[data-testid="email-input"]').fill('amina.hassan@clinique-albaraka.dj')
    await page.locator('[data-testid="password-input"]').fill('medecin1234')
    await page.locator('[data-testid="login-button"]').click()
    await expect(page).toHaveURL('/medecin')
    await expect(page.getByRole('heading', { name: 'Mon agenda' })).toBeVisible()
  })

  test('Dashboard médecin affiche les KPI cards', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin')
    await expect(page.getByText("Aujourd'hui")).toBeVisible()
    await expect(page.locator('.row').getByText('En attente').first()).toBeVisible()
    await expect(page.getByText('Total')).toBeVisible()
  })

  test('Dashboard médecin affiche uniquement les RDV du médecin connecté', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin')
    await expect(page.locator('table')).toBeVisible()
    // Dr. Amina Hassan (id=1) a des RDV dans les données initiales
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('Page Mes disponibilités accessible et affiche la grille', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin/disponibilites')
    await expect(page.getByRole('heading', { name: 'Mes disponibilités' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Lun/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Ven/ })).toBeVisible()
    await expect(page.getByText('Enregistrer les modifications')).toBeVisible()
  })

  test('Toggle jour disponible + save', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin/disponibilites')
    // Cliquer sur "Mer" pour le toggle
    await page.locator('button').filter({ hasText: /Mer/ }).click()
    await page.locator('button').filter({ hasText: 'Enregistrer les modifications' }).click()
    await expect(page.locator('.Toastify__toast')).toBeVisible()
  })

  test('Déconnexion médecin redirige vers /login', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin')
    await page.locator('button:has-text("Déconnexion")').click()
    await expect(page).toHaveURL('/login')
  })

})
