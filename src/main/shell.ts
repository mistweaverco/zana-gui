import { spawn } from 'child_process'

export type ShellOut = {
  stdout: string
  stderr: string
  code: number
  error: Error | null
}

export const shellOut = async (
  cmd: string,
  args: string[] = [],
  cwd: string = process.cwd(),
  env: Record<string, string | undefined> = process.env
): Promise<ShellOut> => {
  return new Promise((resolve) => {
    const s = spawn(cmd, args, {
      cwd,
      shell: true,
      env
    })

    const res: ShellOut = {
      stdout: '',
      stderr: '',
      error: null,
      code: 0
    }

    s.stdout.on('data', (data: Buffer) => {
      res.stdout += data.toString()
    })

    s.stderr.on('data', (data: Buffer) => {
      res.stderr += data.toString()
    })

    s.on('close', (code: number) => {
      res.code = code
      resolve(res)
    })

    s.on('error', (err) => {
      res.error = err
      resolve(res)
    })
  })
}
