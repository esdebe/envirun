import fastGlob from 'fast-glob'

export const discoverEnv = async (): Promise<string[]> => {
  const files = fastGlob(['.env/*.env'], {
    cwd: process.cwd(),
    onlyFiles: true,
    dot: true,
    ignore: ['**/docker/**', '**/local/**', '**/*docker*', '**/*local*'],
  })
  return files
}
