import type { LocalInstalledPackage } from './../../types'
import type { Writable } from 'svelte/store'
import { useWritable } from './UseSharedStore'

export const useActiveView = (): Writable<string> => useWritable('activeView', 'installed')
export const useLocalInstalledPackages = (): Writable<LocalInstalledPackage[]> =>
  useWritable('localPackages', [])
