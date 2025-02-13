import { setLocalPackageVersionToRegistryVersion } from './../files'
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

export const updatePackage = async (sourceId: string): Promise<boolean> => {
  switch (detectProvider(sourceId)) {
    case 'npm':
      if (await npm.install(sourceId)) {
        setLocalPackageVersionToRegistryVersion(sourceId)
        return true
      }
      return false
    case 'github':
      return await github.install(sourceId)
    default:
      return false
  }
}
