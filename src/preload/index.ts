import { ipcRenderer } from 'electron'
import { contextBridge } from 'electron'

const zana = {
  getAppVersion: async (): Promise<string> => {
    return await ipcRenderer.invoke('getAppVersion')
  },
  downloadRegistry: async (): Promise<void> => {
    return await ipcRenderer.invoke('downloadRegistry')
  },
  loadRegistry: async (): Promise<string> => {
    return await ipcRenderer.invoke('loadRegistry')
  }
}

try {
  contextBridge.exposeInMainWorld('zana', zana)
} catch (error) {
  console.error(error)
}
