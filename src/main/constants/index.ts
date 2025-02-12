import { app } from 'electron'
import path from 'path'

export const APP_DIR = path.join(app.getPath('appData'), 'zana')
export const NEOVIM_DIR = path.join(app.getPath('appData'), 'nvim')
export const REGISTRY_FILE = path.join(APP_DIR, 'registry.json')
export const PACKAGES_FILE = path.join(NEOVIM_DIR, 'zana.json')
