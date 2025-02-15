import { ipcRenderer } from 'electron'
import { contextBridge } from 'electron'
import { RegistryPackage, LocalInstalledPackage } from '../types'

const zana = {
  quitApp: async (): Promise<void> => {
    return await ipcRenderer.invoke('quitApp')
  },
  getAppVersion: async (): Promise<string> => {
    return await ipcRenderer.invoke('getAppVersion')
  },
  downloadRegistry: async (): Promise<void> => {
    return await ipcRenderer.invoke('downloadRegistry')
  },
  getRegistry: async (): Promise<RegistryPackage[]> => {
    return await ipcRenderer.invoke('getRegistry')
  },
  loadRegistry: async (): Promise<string> => {
    return await ipcRenderer.invoke('loadRegistry')
  },
  removePackage: async (sourceId: string): Promise<boolean> => {
    return ipcRenderer.invoke('removePackage', sourceId)
  },
  installPackage: async (sourceId: string, version: string): Promise<boolean> => {
    return await ipcRenderer.invoke('installPackage', sourceId, version)
  },
  syncPackages: async (): Promise<boolean> => {
    return await ipcRenderer.invoke('syncPackages')
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
