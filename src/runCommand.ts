import { x } from 'tinyexec'

export const runCommand = async (
  mode: 'development' | 'production',
  env: Record<string, string>
) => {
  return x('pnpm', [mode === 'development' ? 'dev' : 'serve'], {
    nodeOptions: {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...env,
        NODE_ENV: mode,
      },
    },
    throwOnError: false,
  })
}
