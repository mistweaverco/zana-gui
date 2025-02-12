export {}

declare global {
  interface Window {
    zana: {
      getAppVersion: () => Promise<string>
      downloadRegistry: () => Promise<void>
      loadRegistry: () => Promise<string
    }
  }
}
