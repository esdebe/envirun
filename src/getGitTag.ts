import { x } from 'tinyexec'

import { tokenizeArgs } from './tokenizeArgs'

export const getGitTag = async () => {
  try {
    const [command, ...args] = tokenizeArgs('git describe --tags --exact-match')

    const { stdout } = await x(command, args, {
      throwOnError: false,
    })

    return stdout.trim()
  } catch {
    return ''
  }
}
