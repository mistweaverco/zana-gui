import { app } from 'electron'
import path from 'path'

export const APP_DIR = path.join(app.getPath('appData'), 'zana')
export const APP_PACKAGES_DIR = path.join(APP_DIR, 'packages')
export const APP_PACKAGES_NPM_DIR = path.join(APP_PACKAGES_DIR, 'npm')
export const APP_PACKAGES_PYPI_DIR = path.join(APP_PACKAGES_DIR, 'pypi')
export const APP_PACKAGES_GOLANG_DIR = path.join(APP_PACKAGES_DIR, 'golang')
export const NEOVIM_DIR = path.join(app.getPath('appData'), 'nvim')
export const REGISTRY_FILE = path.join(APP_DIR, 'registry.json')
export const PACKAGES_FILE = path.join(NEOVIM_DIR, 'zana-lock.json')
