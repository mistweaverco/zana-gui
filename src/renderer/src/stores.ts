import type { LocalInstalledPackage, RegistryPackage } from './../../types'
import type { Writable } from 'svelte/store'
import { useWritable } from './UseSharedStore'

export const useActiveView = (): Writable<string> => useWritable('activeView', 'installed')
export const useActiveLocalPackageIndex = (): Writable<number> =>
  useWritable('activeLocalPackageIndex', 0)
export const useActiveRemotePackageIndex = (): Writable<number> =>
  useWritable('activeRemotePackageIndex', 0)
export const useLocalInstalledPackages = (): Writable<LocalInstalledPackage[]> =>
  useWritable('localPackages', [])
export const useRegistryPackages = (): Writable<RegistryPackage[]> =>
  useWritable('registryPackages', [])
