import { ipcRenderer } from 'electron'
import { contextBridge } from 'electron'
import { LocalInstalledPackage } from '../types'

const zana = {
  getAppVersion: async (): Promise<string> => {
    return await ipcRenderer.invoke('getAppVersion')
  },
  downloadRegistry: async (): Promise<void> => {
    return await ipcRenderer.invoke('downloadRegistry')
  },
  loadRegistry: async (): Promise<string> => {
    return await ipcRenderer.invoke('loadRegistry')
  },
  updatePackage: async (sourceId: string): Promise<LocalInstalledPackage | null> => {
    return await ipcRenderer.invoke('updatePackage', sourceId)
  },
  updateAllPackages: async (): Promise<LocalInstalledPackage[] | null> => {
    return await ipcRenderer.invoke('updateAllPackages')
  }
}

try {
  contextBridge.exposeInMainWorld('zana', zana)
} catch (error) {
  console.error(error)
}
