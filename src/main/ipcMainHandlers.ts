import { app, ipcMain } from 'electron'
import type { LocalInstalledPackage, RegistryPackage } from './../types'
import { ensureDir, getLocallyInstalledPackages, getRegistryData } from './files'
import { downloadRegistry } from './registry'
import { APP_DIR } from './constants'
import { installPackage, removePackage, syncPackages } from './providers'

// Make sure appDir exists
ensureDir(APP_DIR)

export const ipcMainHandlersInit = (): void => {
  ipcMain.handle('quitApp', (): void => {
    app.quit()
  })

  ipcMain.handle('getAppVersion', (): string => {
    return app.getVersion()
  })

  ipcMain.handle('removePackage', async (_, sourceId: string): Promise<boolean> => {
    return await removePackage(sourceId)
  })

  ipcMain.handle('updateAllPackages', (): LocalInstalledPackage[] | null => {
    console.log('Updating all packages...')
    return null
  })

  ipcMain.handle('syncPackages', async (): Promise<boolean> => {
    return await syncPackages()
  })

  ipcMain.handle(
    'installPackage',
    async (_, sourceId: string, version: string): Promise<boolean> => {
      return await installPackage(sourceId, version)
    }
  )

  ipcMain.handle('getRegistry', (): RegistryPackage[] => {
    return getRegistryData()
  })

  ipcMain.handle('loadRegistry', (): LocalInstalledPackage[] => {
    return getLocallyInstalledPackages()
  })

  ipcMain.handle('downloadRegistry', async (): Promise<boolean> => {
    await downloadRegistry()
    return true
  })
}
