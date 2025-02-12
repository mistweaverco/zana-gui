const install = async (sourceId: string): Promise<boolean> => {
  console.log(`Installing package with sourceId: ${sourceId}`)
  return true
}

export const npm = {
  install
}
