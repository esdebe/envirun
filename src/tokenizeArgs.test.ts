import assert from 'node:assert'
import { test, suite } from 'node:test'

import { tokenizeArgs } from './tokenizeArgs'
suite('tokenizeArgs', () => {
  test('single command', () => {
    assert.deepStrictEqual(tokenizeArgs('command'), ['command'])
  })

  test('space separated arguments', () => {
    assert.deepStrictEqual(tokenizeArgs(`command \targument`), ['command', 'argument'])
  })

  test('quoted arguments', () => {
    assert.deepStrictEqual(tokenizeArgs(`command 'argument1' "argument2"`), [
      'command',
      'argument1',
      'argument2',
    ])
  })

  test('inconsistently quoted arguments', () => {
    assert.deepStrictEqual(tokenizeArgs(`command "arg"um"en"t`), ['command', 'argument'])
  })

  test('detects incomplete quotes ', () => {
    assert.throws(() => {
      tokenizeArgs(`command "arg1 "arg2" "arg3"`)
    }, new Error('Unexpected end of string. Closing quote is missing.'))
  })

  test('forgive incomplete quotes in loose mode', () => {
    assert.deepStrictEqual(tokenizeArgs(`command "arg1 "arg2" "arg3"`, { loose: true }), [
      'command',
      'arg1 arg2 arg3',
    ])
  })

  test('escape quotes and spaces with other quotes', () => {
    assert.deepStrictEqual(tokenizeArgs(`command 'quote "' "quote '"`), [
      'command',
      'quote "',
      "quote '",
    ])
  })

  test('escape quotes with backslashes', () => {
    assert.deepStrictEqual(tokenizeArgs(`command "project \\"argument\\""`), [
      'command',
      'project "argument"',
    ])
  })

  test('escape spaces with backslashes', () => {
    assert.deepStrictEqual(tokenizeArgs(`command space\\ `), ['command', 'space '])
  })

  test('ignore escaped newlines outside of quotes', () => {
    assert.deepStrictEqual(tokenizeArgs(`command \\\nargument`), ['command', `argument`])
    assert.deepStrictEqual(tokenizeArgs(`command "\\\nargument"`), ['command', `\nargument`])
  })

  test('flag argument', () => {
    assert.deepStrictEqual(tokenizeArgs(`command --argument`), ['command', '--argument'])
  })

  test('flag argument with value', () => {
    assert.deepStrictEqual(tokenizeArgs(`command --argument="value"`), [
      'command',
      `--argument=value`,
    ])
  })

  test('json argument', () => {
    assert.deepStrictEqual(tokenizeArgs(`command '{ "param": "value" }'`), [
      'command',
      `{ "param": "value" }`,
    ])
  })

  test('multiline input', () => {
    assert.deepStrictEqual(
      tokenizeArgs(`
      command \\
        --flag=1 \\
        "argument"
    `),
      ['command', '--flag=1', 'argument']
    )
  })

  test('multiline argument', () => {
    assert.deepStrictEqual(
      tokenizeArgs(`command "query Posts {
  posts {
    slug
    title
    updatedAt
    excerpt
  }
}"`),
      [
        'command',
        `query Posts {
  posts {
    slug
    title
    updatedAt
    excerpt
  }
}`,
      ]
    )
  })

  test('empty command', () => {
    assert.deepStrictEqual(tokenizeArgs(``), [])
    assert.deepStrictEqual(tokenizeArgs(`  `), [])
  })
})
