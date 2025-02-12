import { app, ipcMain } from 'electron'
import path from 'path'
import axios from 'axios'
import { ensureDir, appDir, getLocallyInstalledPackages, type LocalInstallFile } from './files'
import fs from 'fs'
import AdmZip from 'adm-zip'

const REGISTRY_URL =
  'https://github.com/mistweaverco/zana-registry/releases/latest/download/registry.json.zip'

const axiosClient = axios.create({
  timeout: 10000
})

// Make sure appDir exists
ensureDir(appDir)

type ZipEntry = {
  entryName: string
  getData: () => Buffer
}

export const ipcMainHandlersInit = (): void => {
  ipcMain.handle('getAppVersion', (): string => {
    return app.getVersion()
  })

  ipcMain.handle('loadRegistry', (): LocalInstallFile => {
    return getLocallyInstalledPackages()
  })

  ipcMain.handle('downloadRegistry', async (): Promise<boolean> => {
    try {
      const res = await axiosClient.get(REGISTRY_URL, {
        responseType: 'arraybuffer'
      })

      const zip = new AdmZip(Buffer.from(res.data))
      const zipEntries = zip.getEntries()

      const registryEntry = zipEntries.find(
        (entry: ZipEntry) => entry.entryName === 'registry.json'
      )

      if (registryEntry) {
        fs.writeFileSync(path.join(appDir, 'registry.json'), registryEntry.getData())
        return true
      } else {
        throw new Error('registry.json not found in the ZIP file.')
      }
    } catch (error) {
      console.error('Error downloading or extracting registry:', error)
      return false
    }
  })
}
