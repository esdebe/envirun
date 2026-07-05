import { describe, expect, it } from 'vitest'

import { parseEnv, splitInLines, unQuote } from './parseEnv'

describe('unQuote', () => {
  it('removes double quotes', () => {
    expect(unQuote('"hello"')).toBe('hello')
  })

  it('removes single quotes', () => {
    expect(unQuote("'hello'")).toBe('hello')
  })

  it('returns original string when not quoted', () => {
    expect(unQuote('hello')).toBe('hello')
  })

  it('does not remove mismatched quotes', () => {
    expect(unQuote('"hello')).toBe('"hello')
    expect(unQuote("hello'")).toBe("hello'")
  })

  it('handles empty quoted strings', () => {
    expect(unQuote('""')).toBe('')
    expect(unQuote("''")).toBe('')
  })
})

describe('splitInLines', () => {
  it('splits normal lines', () => {
    expect(
      splitInLines(`
A=1
B=2
`)
    ).toEqual(['A=1', 'B=2'])
  })

  it('removes empty lines', () => {
    expect(
      splitInLines(`

A=1


B=2

`)
    ).toEqual(['A=1', 'B=2'])
  })

  it('preserves line breaks inside double quotes', () => {
    expect(
      splitInLines(`
A="hello
world"
B=2
`)
    ).toEqual(['A="hello\nworld"', 'B=2'])
  })
})

describe('parseEnv', () => {
  it('parses basic env values', () => {
    expect(
      parseEnv(`
FOO=bar
HELLO=world
`)
    ).toEqual({
      FOO: 'bar',
      HELLO: 'world',
    })
  })

  it('supports ":" separator', () => {
    expect(
      parseEnv(`
FOO:bar
`)
    ).toEqual({
      FOO: 'bar',
    })
  })

  it('trims keys and values', () => {
    expect(
      parseEnv(`
 FOO = bar
`)
    ).toEqual({
      FOO: 'bar',
    })
  })

  it('unquotes quoted values', () => {
    expect(
      parseEnv(`
A="hello"
B='world'
`)
    ).toEqual({
      A: 'hello',
      B: 'world',
    })
  })

  it('supports multiline quoted values', () => {
    expect(
      parseEnv(`
MULTILINE="hello
world"
`)
    ).toEqual({
      MULTILINE: 'hello\nworld',
    })
  })

  it('keeps "=" inside values', () => {
    expect(
      parseEnv(`
TOKEN=abc=123=xyz
`)
    ).toEqual({
      TOKEN: 'abc=123=xyz',
    })
  })

  it('ignores invalid lines', () => {
    expect(
      parseEnv(`
FOO=bar
INVALID_LINE
HELLO=world
`)
    ).toEqual({
      FOO: 'bar',
      HELLO: 'world',
    })
  })

  it('returns empty object for empty input', () => {
    expect(parseEnv('')).toEqual({})
  })
})
