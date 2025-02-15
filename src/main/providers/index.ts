import { installOrUpdatePackage, removePackageFromLocalPackages } from './../files'
import { github } from './github'
import { npm } from './npm'

export const detectProvider = (sourceId: string): 'npm' | 'github' | null => {
  switch (true) {
    case sourceId.startsWith('pkg:npm'):
      return 'npm'
    case sourceId.startsWith('pkg:github'):
      return 'github'
    default:
      return null
  }
}

export const installPackage = async (sourceId: string): Promise<boolean> => {
  switch (detectProvider(sourceId)) {
    case 'npm':
      if (await npm.install(sourceId)) {
        installOrUpdatePackage(sourceId)
        return true
      }
      return false
    case 'github':
      return await github.install(sourceId)
    default:
      return false
  }
}

export const removePackage = async (sourceId: string): Promise<boolean> => {
  switch (detectProvider(sourceId)) {
    case 'npm':
      if (await npm.remove(sourceId)) {
        removePackageFromLocalPackages(sourceId)
        return true
      }
      return false
    case 'github':
      return await github.install(sourceId)
    default:
      return false
  }
}
