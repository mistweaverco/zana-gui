import { detectProvider } from './utils'
import { github } from './github'
import { npm } from './npm'
import { pypi } from './pypi'
import { golang } from './golang'

export const syncPackages = async (): Promise<boolean> => {
  const results = await Promise.allSettled([pypi.sync(), npm.sync(), golang.sync()])
  return results.every((result) => result.status === 'fulfilled' && result.value)
}

export const installPackage = async (sourceId: string, version: string): Promise<boolean> => {
  switch (detectProvider(sourceId)) {
    case 'npm':
      return await npm.install(sourceId, version)
    case 'pypi':
      return await pypi.install(sourceId, version)
    case 'golang':
      return await golang.install(sourceId, version)
    case 'github':
      return await github.install(sourceId)
    default:
      return false
  }
}

export const removePackage = async (sourceId: string): Promise<boolean> => {
  switch (detectProvider(sourceId)) {
    case 'npm':
      return await npm.remove(sourceId)
    case 'pypi':
      return await pypi.remove(sourceId)
    case 'golang':
      return await golang.remove(sourceId)
    case 'github':
      return await github.install(sourceId)
    default:
      return false
  }
}
