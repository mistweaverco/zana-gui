/// <reference types="svelte" />
/// <reference types="vite/client" />

export {}

export * from './types'

declare global {
  interface Window {
    zana: {
      quitApp: () => Promise<void>
      getAppVersion: () => Promise<string>
      downloadRegistry: () => Promise<void>
      getRegistry: () => Promise<RegistryPackage[] | null>
      loadRegistry: () => Promise<LocalInstalledPackage[] | null>
      installPackage: (sourceId: string, version: string) => Promise<boolean>
      syncPackages: () => Promise<boolean>
      removePackage: (sourceId: string) => Promise<boolean>
      updateAllPackages: () => Promise<LocalInstalledPackage[] | null>
    }
  }
}
