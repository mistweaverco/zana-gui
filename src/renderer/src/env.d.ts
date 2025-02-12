/// <reference types="svelte" />
/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    zana: {
      getAppVersion: () => Promise<string>
      downloadRegistry: () => Promise<void>
      loadRegistry: () => Promise<[]>
    }
  }
}
