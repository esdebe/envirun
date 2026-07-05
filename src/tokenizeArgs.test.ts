import assert from 'node:assert'

import { expect, test, describe } from 'vitest'

import { tokenizeArgs } from './tokenizeArgs'
describe('tokenizeArgs', () => {
  test('single command', () => {
    expect(tokenizeArgs('command')).toStrictEqual(['command'])
  })

  test('space separated arguments', () => {
    expect(tokenizeArgs(`command \targument`)).toStrictEqual(['command', 'argument'])
  })

  test('quoted arguments', () => {
    expect(tokenizeArgs(`command 'argument1' "argument2"`)).toStrictEqual([
      'command',
      'argument1',
      'argument2',
    ])
  })

  test('inconsistently quoted arguments', () => {
    expect(tokenizeArgs(`command "arg"um"en"t`)).toStrictEqual(['command', 'argument'])
  })

  test('detects incomplete quotes', () => {
    assert.throws(() => {
      tokenizeArgs(`command "arg1 "arg2" "arg3"`)
    }, new Error('Unexpected end of string. Closing quote is missing.'))
  })

  test('forgive incomplete quotes in loose mode', () => {
    expect(tokenizeArgs(`command "arg1 "arg2" "arg3"`, { loose: true })).toStrictEqual([
      'command',
      'arg1 arg2 arg3',
    ])
  })

  test('escape quotes and spaces with other quotes', () => {
    expect(tokenizeArgs(`command 'quote "' "quote '"`)).toStrictEqual([
      'command',
      'quote "',
      "quote '",
    ])
  })

  test('escape quotes with backslashes', () => {
    expect(tokenizeArgs(`command "project \\"argument\\""`)).toStrictEqual([
      'command',
      'project "argument"',
    ])
  })

  test('escape spaces with backslashes', () => {
    expect(tokenizeArgs(`command space\\ `)).toStrictEqual(['command', 'space '])
  })

  test('ignore escaped newlines outside of quotes', () => {
    expect(tokenizeArgs(`command \\\nargument`)).toStrictEqual(['command', `argument`])
    expect(tokenizeArgs(`command "\\\nargument"`)).toStrictEqual(['command', `\nargument`])
  })

  test('flag argument', () => {
    expect(tokenizeArgs(`command --argument`)).toStrictEqual(['command', '--argument'])
  })

  test('flag argument with value', () => {
    expect(tokenizeArgs(`command --argument="value"`)).toStrictEqual([
      'command',
      `--argument=value`,
    ])
  })

  test('json argument', () => {
    expect(tokenizeArgs(`command '{ "param": "value" }'`)).toStrictEqual([
      'command',
      `{ "param": "value" }`,
    ])
  })

  test('multiline input', () => {
    expect(
      tokenizeArgs(`
      command \\
        --flag=1 \\
        "argument"
    `)
    ).toStrictEqual(['command', '--flag=1', 'argument'])
  })

  test('multiline argument', () => {
    expect(
      tokenizeArgs(`command "query Posts {
  posts {
    slug
    title
    updatedAt
    excerpt
  }
}"`)
    ).toStrictEqual([
      'command',
      `query Posts {
  posts {
    slug
    title
    updatedAt
    excerpt
  }
}`,
    ])
  })

  test('empty command', () => {
    expect(tokenizeArgs(``)).toStrictEqual([])
    expect(tokenizeArgs(`  `)).toStrictEqual([])
  })
})
