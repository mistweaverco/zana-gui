/// <reference types="svelte" />
/// <reference types="vite/client" />

export {}

export * from './types'

declare global {
  interface Window {
    zana: {
      getAppVersion: () => Promise<string>
      downloadRegistry: () => Promise<void>
      loadRegistry: () => Promise<LocalInstalledPackage[] | null>
      updatePackage: (sourceId: string) => Promise<LocalInstalledPackage | null>
      updateAllPackages: () => Promise<LocalInstalledPackage[] | null>
    }
  }
}
