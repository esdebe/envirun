import { x } from 'tinyexec'

import { tokenizeArgs } from './tokenizeArgs'

const main = async () => {
  console.log(`Hello Node.js v${process.versions.node}!`)

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
    const [command, ...args] = tokenizeArgs('git rev-parse --short HEAD')
    const { stdout, stderr } = await x(command, args, {
      nodeOptions: { env: { test: '123' } },
      throwOnError: false,
    })

    console.log(stdout, stderr)
  } catch (error) {
    console.log('Error', error)
  }

  try {
    const [command, ...args] = tokenizeArgs('git status --short')
    const { stdout, stderr } = await x(command, args, {
      nodeOptions: { env: { test: '123' } },
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

  console.log('test')
}

main()
