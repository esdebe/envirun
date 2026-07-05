import { describe, expect, it } from 'vitest'

import { stringify } from './stringify'

describe('stringify', () => {
  it('stringifies simple key/value pairs', () => {
    expect(
      stringify({
        FOO: 'bar',
        HELLO: 'world',
      })
    ).toBe(
      `FOO=bar
HELLO=world
`
    )
  })

  it('converts numbers to strings', () => {
    expect(
      stringify({
        PORT: 3000,
      })
    ).toBe(
      `PORT=3000
`
    )
  })

  it('converts booleans to strings', () => {
    expect(
      stringify({
        ENABLED: true,
        DISABLED: false,
      })
    ).toBe(
      `ENABLED=true
DISABLED=false
`
    )
  })

  it('escapes line breaks', () => {
    expect(
      stringify({
        MULTILINE: 'hello\nworld',
      })
    ).toBe(
      `MULTILINE="hello\\nworld"
`
    )
  })

  it('handles null and undefined', () => {
    expect(
      stringify({
        NULL_VALUE: null,
        UNDEFINED_VALUE: undefined,
      })
    ).toBe(
      `NULL_VALUE=null
UNDEFINED_VALUE=undefined
`
    )
  })

  it('ignores empty keys', () => {
    expect(
      stringify({
        '': 'ignored',
        VALID: 'yes',
      })
    ).toBe(
      `VALID=yes
`
    )
  })

  it('returns empty string for empty object', () => {
    expect(stringify({})).toBe('')
  })

  it('preserves special characters', () => {
    expect(
      stringify({
        TOKEN: 'abc=123:xyz',
      })
    ).toBe(
      `TOKEN=abc=123:xyz
`
    )
  })
})
