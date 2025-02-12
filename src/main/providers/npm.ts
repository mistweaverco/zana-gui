const getRepo = async (sourceId: string): Promise<string> => {
  return sourceId.replace(/^pkg:npm\/(.*)/, '$1')
}
const install = async (sourceId: string): Promise<boolean> => {
  console.log(`Installing package with sourceId: ${sourceId}`)
  const repo = await getRepo(sourceId)
  console.log(`Installing package from repo: ${repo}`)
  return true
}

export const npm = {
  install
}
