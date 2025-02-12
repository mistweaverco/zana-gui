import fs from 'fs'
import type { LocalInstalledPackage, LocalPackage, RegistryPackage } from './../types'
import { PACKAGES_FILE, REGISTRY_FILE } from './constants'

export const ensureDir = (dir: string): void => {
  fs.mkdirSync(dir, { recursive: true })
}

const isUpdateAvailable = (localVersion: string, registryVersion: string): boolean => {
  const localVersionParts = localVersion.split('.')
  const registryVersionParts = registryVersion.split('.')

  for (let i = 0; i < localVersionParts.length; i++) {
    if (parseInt(localVersionParts[i]) < parseInt(registryVersionParts[i])) {
      return true
    }
  }

  return false
}

export const getLocallyInstalledPackages = (): LocalInstalledPackage[] => {
  if (!fs.existsSync(REGISTRY_FILE)) {
    return []
  }
  if (!fs.existsSync(PACKAGES_FILE)) {
    return []
  }

  const registryData = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8'))
  const localPackages = JSON.parse(fs.readFileSync(PACKAGES_FILE, 'utf-8'))

  return localPackages.packages
    .filter((localPackage: LocalPackage) =>
      registryData.some(
        (registryPackage: RegistryPackage) => registryPackage.source.id === localPackage.sourceId
      )
    )
    .map((localPackage: LocalPackage) => {
      const registryPackage = registryData.find(
        (registryPackage: RegistryPackage) => registryPackage.source.id === localPackage.sourceId
      )
      return {
        ...registryPackage,
        localVersion: localPackage.version,
        updateAvailable: isUpdateAvailable(localPackage.version, registryPackage.version)
      }
    })
    .sort((a: LocalInstalledPackage, b: LocalInstalledPackage) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
}
