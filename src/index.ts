import { intro, outro, select, spinner } from '@clack/prompts'
import { x } from 'tinyexec'

import { discover } from './discover'
import { tokenizeArgs } from './tokenizeArgs'

const main = async () => {
  intro(`Hello Node.js v${process.versions.node}!`)

  const s = spinner()

  const selected = await select({
    message: 'Select env',
    options: [
      { label: 'Development', value: 'development' },
      { label: 'Production', value: 'production' },
    ],
  })

  console.log(selected)

  s.start()
  const files = await discover()
  s.stop()

  console.log(files)

  try {
    const [command, ...args] = tokenizeArgs('git tag --points-at HEAD | head -n 1')
    const { stdout, stderr } = await x(command, args, {
      nodeOptions: { env: { test: '123' } },
      throwOnError: false,
    })

    console.log(stdout, stderr)
  } catch (error) {
    console.log('Error', error)
  }

  try {
    const [command, ...args] = tokenizeArgs('git tag --points-at HEAD | head -n 1')
    const [command2, ...args2] = tokenizeArgs('head -n 1')
    const { stdout, stderr } = await x(command, args, {
      throwOnError: false,
    }).pipe(command2, args2)

    console.log(stdout, stderr)
  } catch (error) {
    console.log('Error', error)
  }

  try {
    const [command, ...args] = tokenizeArgs('git rev-parse --short HEAD')
    const { stdout, stderr } = await x(command, args, {
      throwOnError: false,
    })

    console.log(stdout, stderr)
  } catch (error) {
    console.log('Error', error)
  }

  try {
    const [command, ...args] = tokenizeArgs('git status --short')
    const { stdout, stderr } = await x(command, args, {
      throwOnError: false,
    })

    console.log(stdout, stderr)
  } catch (error) {
    console.log('Error', error)
  }

  try {
    const [command, ...args] = tokenizeArgs('node -e console.log(process.env.MY_VARIABLE)')
    const { stdout, stderr } = await x(command, args, {
      nodeOptions: { env: { MY_VARIABLE: '123' } },
      throwOnError: false,
    })

    console.log(stdout, stderr)
  } catch (error) {
    console.log('Error', error)
  }

  outro('Done')
}

main()
