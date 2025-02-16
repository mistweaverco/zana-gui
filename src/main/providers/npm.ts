import fs from 'fs'
import path from 'path'
import { detectProvider } from './utils'
import { getLocalPackages, installOrUpdatePackage, removePackageFromLocalPackages } from '../files'
import { APP_PACKAGES_NPM_DIR } from './../constants'
import { shellOut } from './../shell'

const getRepo = (sourceId: string): string => {
  return sourceId.replace(/^pkg:npm\/(.*)/, '$1')
}

const generatePackageJson = (): void => {
  const packageJson = {
    dependencies: {}
  }
  const localPackages = getLocalPackages()
  for (const pkg of localPackages) {
    if (detectProvider(pkg.sourceId) !== 'npm') continue
    packageJson.dependencies[getRepo(pkg.sourceId)] = pkg.version
  }
  fs.writeFileSync(
    path.join(APP_PACKAGES_NPM_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  )
}

const sync = async (): Promise<boolean> => {
  if (!fs.existsSync(APP_PACKAGES_NPM_DIR)) {
    fs.mkdirSync(APP_PACKAGES_NPM_DIR)
  }
  generatePackageJson()

  const pruneRes = await shellOut('npm', ['prune'], APP_PACKAGES_NPM_DIR)
  if (pruneRes.code !== 0) {
    return false
  }
  const res = await shellOut('npm', ['install'], APP_PACKAGES_NPM_DIR)
  return res.code === 0
}

const install = async (sourceId: string, version: string): Promise<boolean> => {
  await installOrUpdatePackage(sourceId, version)
  return await sync()
}

const remove = async (sourceId: string): Promise<boolean> => {
  removePackageFromLocalPackages(sourceId)
  return await sync()
}

export const npm = {
  install,
  remove,
  sync
}
