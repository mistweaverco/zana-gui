import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export const appDir = path.join(app.getPath('appData'), 'zana')
export const neovimDir = path.join(app.getPath('appData'), 'nvim')

export const ensureDir = (dir: string): void => {
  fs.mkdirSync(dir, { recursive: true })
}

type RegistryPackageSourceAsset = {
  target: string
  file: string
}

type RegistryPackageSource = {
  id: string
  asset: RegistryPackageSourceAsset[]
}

type RegistryPackageBin = {
  [key: string]: string
}

type RegistryPackage = {
  name: string
  source: RegistryPackageSource
  homepage: string
  licenses: string[]
  languages: string[]
  categories: string[]
  bin: RegistryPackageBin
  version: string
}

export type LocalPackage = {
  sourceId: string
  version: string
}

export type LocalInstallFile = {
  packages: LocalPackage[]
}

export type LocalInstalledPackage = RegistryPackage & {
  localVersion: string
  updateAvailable: boolean
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
  const registry = path.join(appDir, 'registry.json')
  const packages = path.join(neovimDir, 'zana.json')

  if (!fs.existsSync(registry)) {
    return []
  }
  if (!fs.existsSync(packages)) {
    return []
  }

  const registryData = JSON.parse(fs.readFileSync(registry, 'utf-8'))
  const localPackages = JSON.parse(fs.readFileSync(packages, 'utf-8'))

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
