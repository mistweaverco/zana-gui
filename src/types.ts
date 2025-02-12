export type ZipEntry = {
  entryName: string
  getData: () => Buffer
}

export type RegistryPackageSourceAsset = {
  target: string
  file: string
}

export type RegistryPackageSource = {
  id: string
  asset: RegistryPackageSourceAsset[]
}

export type RegistryPackageBin = {
  [key: string]: string
}

export type RegistryPackage = {
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
