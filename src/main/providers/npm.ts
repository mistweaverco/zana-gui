import { APP_PACKAGES_NPM_DIR } from './../constants'
import { shellOut } from './../shell'

const getRepo = async (sourceId: string): Promise<string> => {
  return sourceId.replace(/^pkg:npm\/(.*)/, '$1')
}

const install = async (sourceId: string): Promise<boolean> => {
  const repo = await getRepo(sourceId)
  const res = await shellOut('npm', ['install', repo], APP_PACKAGES_NPM_DIR)
  return res.code === 0
}

const remove = async (sourceId: string): Promise<boolean> => {
  const repo = await getRepo(sourceId)
  const res = await shellOut('npm', ['remove', repo], APP_PACKAGES_NPM_DIR)
  return res.code === 0
}

export const npm = {
  install,
  remove
}
