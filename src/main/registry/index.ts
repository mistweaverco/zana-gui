import type { ZipEntry } from './../../types'
import axios from 'axios'
import fs from 'fs'
import AdmZip from 'adm-zip'
import { REGISTRY_FILE } from '../constants'

const REGISTRY_URL =
  'https://github.com/mistweaverco/zana-registry/releases/latest/download/registry.json.zip'

const axiosClient = axios.create({
  timeout: 10000
})

export const downloadRegistry = async (): Promise<boolean> => {
  try {
    const res = await axiosClient.get(REGISTRY_URL, {
      responseType: 'arraybuffer'
    })

    const zip = new AdmZip(Buffer.from(res.data))
    const zipEntries = zip.getEntries()

    const registryEntry = zipEntries.find((entry: ZipEntry) => entry.entryName === 'registry.json')

    if (registryEntry) {
      fs.writeFileSync(REGISTRY_FILE, registryEntry.getData())
      return true
    } else {
      throw new Error('registry.json not found in the ZIP file.')
    }
  } catch (error) {
    console.error('Error downloading or extracting registry:', error)
    return false
  }
}
