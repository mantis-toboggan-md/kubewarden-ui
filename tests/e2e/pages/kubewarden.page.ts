import { expect, test, Locator, Page } from '@playwright/test'
import { RancherAppsPage } from '../rancher/rancher-apps.page'
import { BasePage } from '../rancher/basepage'
import { Shell } from '../components/kubectl-shell'

type Pane = 'Policy Servers' | 'Admission Policies' | 'Cluster Admission Policies'

export class KubewardenPage extends BasePage {
    readonly createPsBtn: Locator;
    readonly createApBtn: Locator;
    readonly createCapBtn: Locator;

    constructor(page: Page) {
      super(page)
      this.createPsBtn = this.ui.button('Create Policy Server')
      this.createApBtn = this.ui.button('Create Admission Policy')
      this.createCapBtn = this.ui.button('Create Cluster Admission Policy')
    }

    async goto(): Promise<void> {
      await this.nav.explorer('Kubewarden')
      // await this.nav.goto('dashboard/c/local/kubewarden')
    }

    getPane(name: Pane) {
      return this.page.locator('div.card-container').filter({
        has: this.page.getByRole('heading', { name, exact: true })
      })
    }

    getStats(pane: Pane) {
      return this.getPane(pane).locator('span.numbers-stats')
    }

    async installKubewarden() {
      // ==================================================================================================
      // Requirements Dialog
      const welcomeStep = this.page.getByText('Kubewarden is a policy engine for Kubernetes.')
      const certStep = this.page.getByText('Install Cert-Manager Package')
      const addRepoStep = this.page.getByRole('heading', { name: 'Repository', exact: true })
      const appInstallStep = this.page.getByRole('heading', { name: 'Kubewarden App Install', exact: true })
      const shellBtn = this.page.getByRole('button', { name: 'Open Kubectl Shell' })
      const installBtn = this.ui.button('Install Kubewarden')
      const addRepoBtn = this.ui.button('Add Kubewarden Repository')
      const failRepo = this.page.getByText('Unable to fetch Kubewarden Helm chart')
      const failRepoBtn = this.ui.button('Reload')

      // Welcome screen
      await this.ui.withReload(async() => {
        await this.goto()
      }, 'Kubewarden extension not visible')

      await expect(welcomeStep).toBeVisible()
      await installBtn.click()

      // Cert-Manager
      await certStep.or(addRepoBtn).waitFor()
      if (await certStep.isVisible()) {
        // Copy command by clicking and read it from clipboard
        await this.page.locator('code.copy').click()
        const copiedText = await this.page.evaluate(() => navigator.clipboard.readText())
        expect(copiedText).toContain('kubectl')
        // Run copied command in shell
        await shellBtn.click()
        const shell = new Shell(this.page)
        await expect(shell.prompt).toBeVisible()
        await shell.run(copiedText as string)
      }

      // Add repository screen
      await expect(addRepoStep).toBeVisible()
      await addRepoBtn.click()
      // Wait repo state changes between Active / In Progress
      await this.page.waitForTimeout(5_000)

      // Wait for install button or handle repo failure
      try {
        await expect(installBtn).toBeVisible()
      } catch (e) {
        test.info().annotations.push({ type: 'BUG', description: 'Failed to add kw repository' })
        // 2 possible fails
        await expect(failRepo.or(addRepoBtn)).toBeVisible()
        if (await failRepo.isVisible()) {
          await failRepoBtn.click()
        } else {
          await this.page.reload()
        }
        await expect(welcomeStep).toBeVisible()
        await installBtn.click()
      }

      // Redirection to rancher app installer
      await expect(appInstallStep).toBeVisible()
      await installBtn.click()
      await expect(this.page).toHaveURL(/.*\/apps\/charts\/install.*chart=kubewarden-controller/)

      // ==================================================================================================
      // Rancher Application Metadata
      const apps = new RancherAppsPage(this.page)
      await expect(apps.step1).toBeVisible()
      await apps.nextBtn.click()
      await expect(apps.step2).toBeVisible()

      // Rancher Application Values
      await expect(this.ui.checkbox('Enable Background Audit check ')).toBeChecked()
      const schedule = this.ui.input('Schedule')
      await expect(schedule).toHaveValue('*/60 * * * *')
      await schedule.fill('*/1 * * * *')
      await this.ui.checkbox('Enable Policy Reporter').check()

      // Start installation
      await apps.installBtn.click()
      await apps.waitHelmSuccess('rancher-kubewarden-crds', { keepLog: true })
      await apps.waitHelmSuccess('rancher-kubewarden-controller')
    }
}
