export const detectProvider = (sourceId: string): 'npm' | 'github' | 'pypi' | null => {
  switch (true) {
    case sourceId.startsWith('pkg:npm'):
      return 'npm'
    case sourceId.startsWith('pkg:pypi'):
      return 'pypi'
    case sourceId.startsWith('pkg:github'):
      return 'github'
    default:
      return null
  }
}
