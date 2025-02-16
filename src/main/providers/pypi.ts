import fs from 'fs'
import path from 'path'
import { getLocalPackages, installOrUpdatePackage, removePackageFromLocalPackages } from '../files'
import { APP_PACKAGES_PYPI_DIR } from './../constants'
import { shellOut } from './../shell'
import { detectProvider } from './utils'

const getRepo = (sourceId: string): string => {
  return sourceId.replace(/^pkg:pypi\/(.*)/, '$1')
}

const generateRequirementsTxt = (): void => {
  const requirementsAsJson = {}
  const localPackages = getLocalPackages()
  for (const pkg of localPackages) {
    if (detectProvider(pkg.sourceId) !== 'pypi') continue
    requirementsAsJson[getRepo(pkg.sourceId)] = pkg.version
  }
  const sortedByKey = Object.keys(requirementsAsJson)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = requirementsAsJson[key]
        return acc
      },
      {} as Record<string, number>
    )
  let requirementsTxt = ''
  for (const [pkg, version] of Object.entries(sortedByKey)) {
    requirementsTxt += `${pkg}==${version}\n`
  }
  fs.writeFileSync(path.join(APP_PACKAGES_PYPI_DIR, 'requirements.txt'), requirementsTxt, 'utf-8')
}

const sync = async (): Promise<boolean> => {
  if (!fs.existsSync(APP_PACKAGES_PYPI_DIR)) {
    fs.mkdirSync(APP_PACKAGES_PYPI_DIR)
  }
  generateRequirementsTxt()
  const res = await shellOut(
    'pip',
    ['install', '-r', 'requirements.txt', '--target', 'pkgs'],
    APP_PACKAGES_PYPI_DIR
  )
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

export const pypi = {
  install,
  remove,
  sync
}
