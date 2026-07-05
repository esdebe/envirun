import { x } from 'tinyexec'

import { tokenizeArgs } from './tokenizeArgs'

export const getGitShortSha = async () => {
  try {
    const [gitRevParseCommand, ...args] = tokenizeArgs('git rev-parse --short HEAD')
    const { stdout } = await x(gitRevParseCommand, args, { throwOnError: false })
    return stdout.trim()
  } catch {
    return ''
  }
}
