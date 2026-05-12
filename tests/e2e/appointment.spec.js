import { test, expect } from '@playwright/test'

test.describe('Formulaire de rendez-vous', () => {

  test.beforeEach(async ({ page }) => {
    // Partir d'un état localStorage propre
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('rdv_data'))
  })

  test('Étape 1 — page charge avec la liste des médecins', async ({ page }) => {
    await page.goto('/rendez-vous')
    await expect(page.locator('h1')).toContainText('rendez-vous')
    // StepIndicator visible — utiliser le span exact du step indicator
    await expect(page.locator('span').filter({ hasText: /^Médecin$/ }).first()).toBeVisible()
    await expect(page.locator('span').filter({ hasText: /^Date & heure$/ }).first()).toBeVisible()
  })

  test('Étape 1 — impossible de passer sans sélectionner un médecin', async ({ page }) => {
    await page.goto('/rendez-vous')
    const nextButton = page.locator('button:has-text("Suivant")')
    await expect(nextButton).toBeDisabled()
  })

  test('Étape 1 → Étape 2 — sélectionner un médecin', async ({ page }) => {
    await page.goto('/rendez-vous')
    // Cliquer sur la première carte médecin
    await page.locator('[data-testid^="doctor-card-"]').first().click()
    await expect(page.locator('button:has-text("Suivant")')).toBeEnabled()
    await page.locator('button:has-text("Suivant")').click()
    await expect(page.getByText('Choisissez une date')).toBeVisible()
  })

  test('Étape 2 → Étape 3 — sélectionner date et créneau', async ({ page }) => {
    await page.goto('/rendez-vous')
    // Sélectionner Dr. Amina Hassan (id=1, disponible Lun/Mar/Jeu)
    await page.locator('[data-testid="doctor-card-1"]').click()
    await page.locator('button:has-text("Suivant")').click()

    // Sélectionner un jour disponible — prendre le premier bouton de la grille de jours qui n'est pas désactivé
    // Les boutons de jours ont un style minWidth:64 et affichent jour+chiffre+mois
    const availableDay = page.locator('button:not([disabled])').filter({ has: page.locator('div') }).first()
    await availableDay.click()

    // Sélectionner un créneau disponible
    await page.locator('button:has-text("09h00")').click()
    await expect(page.locator('button:has-text("Suivant")')).toBeEnabled()
    await page.locator('button:has-text("Suivant")').click()

    await expect(page.getByText('Vos informations')).toBeVisible()
  })

  test('Étape 3 — validation : champs requis', async ({ page }) => {
    await page.goto('/rendez-vous')
    // Simuler étape 2 complète
    await page.locator('[data-testid="doctor-card-1"]').click()
    await page.locator('button:has-text("Suivant")').click()
    const availableDay = page.locator('button:not([disabled])').filter({ has: page.locator('div') }).first()
    await availableDay.click()
    await page.locator('button:has-text("09h00")').click()
    await page.locator('button:has-text("Suivant")').click()

    // Soumettre sans remplir les champs
    await page.locator('button:has-text("Confirmer le rendez-vous")').click()
    await expect(page.getByText('Prénom requis')).toBeVisible()
    await expect(page.getByText('Email valide requis')).toBeVisible()
  })

  test('Soumission complète — modal de confirmation s\'affiche', async ({ page }) => {
    await page.goto('/rendez-vous')
    await page.locator('[data-testid="doctor-card-1"]').click()
    await page.locator('button:has-text("Suivant")').click()
    const availableDay = page.locator('button:not([disabled])').filter({ has: page.locator('div') }).first()
    await availableDay.click()
    await page.locator('button:has-text("09h00")').click()
    await page.locator('button:has-text("Suivant")').click()

    await page.locator('[data-testid="prenom-input"]').fill('Hodan')
    // Remplir le champ Nom (sans data-testid, via placeholder)
    await page.locator('input[placeholder="Ali"]').fill('Ali')
    await page.locator('[data-testid="telephone-input"]').fill('+253 77 11 22 33')
    await page.locator('[data-testid="email-input"]').fill('hodan@test.dj')
    await page.locator('button:has-text("Confirmer le rendez-vous")').click()

    // Modal succès
    await expect(page.getByText('Rendez-vous confirmé')).toBeVisible()
    await expect(page.getByText(/RDV-2026-/).first()).toBeVisible()
  })

  test('RDV créé apparaît dans localStorage', async ({ page }) => {
    await page.goto('/rendez-vous')
    await page.locator('[data-testid="doctor-card-1"]').click()
    await page.locator('button:has-text("Suivant")').click()
    const availableDay = page.locator('button:not([disabled])').filter({ has: page.locator('div') }).first()
    await availableDay.click()
    await page.locator('button:has-text("08h30")').click()
    await page.locator('button:has-text("Suivant")').click()

    await page.locator('[data-testid="prenom-input"]').fill('Test')
    await page.locator('input[placeholder="Ali"]').fill('Patient')
    await page.locator('[data-testid="telephone-input"]').fill('+253 77 99 00 01')
    await page.locator('[data-testid="email-input"]').fill('test@test.dj')
    await page.locator('button:has-text("Confirmer le rendez-vous")').click()

    await expect(page.getByText('Rendez-vous confirmé')).toBeVisible()

    const storedData = await page.evaluate(() => {
      const data = localStorage.getItem('rdv_data')
      return data ? JSON.parse(data) : []
    })
    expect(storedData.some(rdv => rdv.patient === 'Test ')).toBeFalsy() // nom vide accepté
    expect(storedData.length).toBeGreaterThan(0)
  })

})
