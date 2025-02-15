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

export const installOrUpdatePackage = async (
  sourceId: string,
  version: string
): Promise<boolean> => {
  const registryData = getRegistryData()
  const localPackages = getLocalPackages()

  const localPackage = localPackages.find(
    (localPackage: LocalPackage) => localPackage.sourceId === sourceId
  )
  const registryPackage = registryData.find(
    (registryPackage: RegistryPackage) => registryPackage.source.id === sourceId
  )
  if (!registryPackage) {
    return false
  }
  if (!localPackage) {
    localPackages.push({ sourceId, version })
  }
  if (!localPackage || isUpdateAvailable(localPackage.version, registryPackage.version)) {
    const targetPackage = localPackages.find(
      (localPackage: LocalPackage) => localPackage.sourceId === sourceId
    )
    if (targetPackage) {
      targetPackage.version = registryPackage.version
    }
  }
  // Sort localPackages by sourceId, so that the file is always the same
  // and people using git, don't get a lot of changes and freak out
  localPackages.sort((a: LocalPackage, b: LocalPackage) => {
    if (a.sourceId < b.sourceId) {
      return -1
    }
    if (a.sourceId > b.sourceId) {
      return 1
    }
    return 0
  })
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify({ packages: localPackages }, null, 2))
  return true
}

export const removePackageFromLocalPackages = (sourceId: string): void => {
  const localPackages = getLocalPackages()
  const newLocalPackages = localPackages.filter(
    (localPackage: LocalPackage) => localPackage.sourceId !== sourceId
  )
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify({ packages: newLocalPackages }, null, 2))
}

export const getRegistryData = (): RegistryPackage[] => {
  if (!fs.existsSync(REGISTRY_FILE)) {
    return []
  }
  const pkgs = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8')) as RegistryPackage[]
  return pkgs.sort((a: RegistryPackage, b: RegistryPackage) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
}

export const getPackageBySourceId = (sourceId: string): RegistryPackage | null => {
  const registryData = getRegistryData()
  for (const regPkg of registryData) {
    if (regPkg.source.id === sourceId) {
      return regPkg
    }
  }
  return null
}

export const getLocalPackages = (): LocalPackage[] => {
  if (!fs.existsSync(PACKAGES_FILE)) {
    return []
  }
  return JSON.parse(fs.readFileSync(PACKAGES_FILE, 'utf-8')).packages
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
