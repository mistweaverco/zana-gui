import fs from 'fs'
import path from 'path'
import { getLocalPackages } from '../files'
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
  const res = await shellOut('npm', ['install'], APP_PACKAGES_NPM_DIR)
  return res.code === 0
}

const install = async (sourceId: string, version: string): Promise<boolean> => {
  const repo = getRepo(sourceId)
  const res = await shellOut(
    'npm',
    ['install', '--save-exact', `${repo}@${version}`],
    APP_PACKAGES_NPM_DIR
  )
  return res.code === 0
}

const remove = async (sourceId: string): Promise<boolean> => {
  const repo = getRepo(sourceId)
  const res = await shellOut('npm', ['remove', repo], APP_PACKAGES_NPM_DIR)
  return res.code === 0
}

export const npm = {
  install,
  remove,
  sync
}
