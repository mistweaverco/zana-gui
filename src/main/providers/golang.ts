import fs from 'fs'
import path from 'path'
import { detectProvider } from './utils'
import { getLocalPackages, installOrUpdatePackage, removePackageFromLocalPackages } from '../files'
import { APP_PACKAGES_GOLANG_DIR } from './../constants'
import { shellOut } from './../shell'

const getRepo = (sourceId: string): string => {
  return sourceId.replace(/^pkg:golang\/(.*)/, '$1')
}

// If no local packages are found, return false
const generatePackageJson = (): boolean => {
  let found = false
  const packageJson = {}
  const localPackages = getLocalPackages()
  for (const pkg of localPackages) {
    if (detectProvider(pkg.sourceId) !== 'golang') continue
    packageJson[getRepo(pkg.sourceId)] = pkg.version
    found = true
  }
  // to array
  const arr = Object.keys(packageJson).map((key) => {
    return `${key}@${packageJson[key]}`
  })
  fs.writeFileSync(
    path.join(APP_PACKAGES_GOLANG_DIR, 'package.json'),
    JSON.stringify(arr, null, 2),
    'utf-8'
  )
  return found
}

const sync = async (): Promise<boolean> => {
  if (!fs.existsSync(APP_PACKAGES_GOLANG_DIR)) {
    fs.mkdirSync(APP_PACKAGES_GOLANG_DIR)
  }
  if (!fs.existsSync(path.join(APP_PACKAGES_GOLANG_DIR, 'bin'))) {
    fs.mkdirSync(path.join(APP_PACKAGES_GOLANG_DIR, 'bin'))
  }
  const packagesFound = generatePackageJson()

  if (!packagesFound) {
    return true
  }

  const pkgs = JSON.parse(
    fs.readFileSync(path.join(APP_PACKAGES_GOLANG_DIR, 'package.json'), 'utf8')
  )
  const jobs = pkgs.map(async (pkg: string): Promise<boolean> => {
    console.log(`Installing ${pkg}`)
    const res = await shellOut('go', ['install', pkg], APP_PACKAGES_GOLANG_DIR, {
      ...process.env,
      GOBIN: path.join(APP_PACKAGES_GOLANG_DIR, 'bin')
    })
    return res.code === 0
  })

  const results = await Promise.allSettled(jobs)
  return results.every((result) => result.status === 'fulfilled' && result.value)
}

const install = async (sourceId: string, version: string): Promise<boolean> => {
  await installOrUpdatePackage(sourceId, version)
  return await sync()
}

const remove = async (sourceId: string): Promise<boolean> => {
  removePackageFromLocalPackages(sourceId)
  return await sync()
}

export const golang = {
  install,
  remove,
  sync
}
