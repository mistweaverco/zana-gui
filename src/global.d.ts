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
      installPackage: (sourceId: string) => Promise<boolean>
      removePackage: (sourceId: string) => Promise<LocalInstalledPackage[] | null>
      updateAllPackages: () => Promise<LocalInstalledPackage[] | null>
    }
  }
}
