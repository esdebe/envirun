import { isCancel, select } from '@clack/prompts'

import { discoverEnv } from './discoverEnv'
import { getGitShortSha } from './getGitShortSha'
import { getGitTag } from './getGitTag'
import { loadEnv } from './loadEnv'
import { runCommand } from './runCommand'

export const envirun = async () => {
  try {
    const mode = await select({
      message: 'Select Mode',
      options: [
        {
          label: 'Development',
          value: 'development',
        },
        {
          label: 'Production',
          value: 'production',
        },
      ],
    })

    if (isCancel(mode)) {
      console.log('Operation cancelled')
      process.exit(0)
    }

    const envs = await discoverEnv()

    const gitShortSha = await getGitShortSha()

    const gitTag = await getGitTag()

    const envPath = await select({
      message: 'Select Env',
      options: envs.map((value) => ({
        label: value,
        value,
      })),
    })

    if (isCancel(envPath)) {
      console.log('Operation cancelled')
      process.exit(0)
    }

    const env = await loadEnv(envPath)

    runCommand(mode, {
      ...env,
      GIT_SHA: gitShortSha,
      GIT_TAG: gitTag,
    })
  } catch (error) {
    console.error({ error })
    process.exit(1)
  }
}
