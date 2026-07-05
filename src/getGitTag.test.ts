import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('tinyexec', () => ({
  x: vi.fn<() => void>(),
}))

vi.mock('./tokenizeArgs', () => ({
  tokenizeArgs: vi.fn<() => void>(),
}))

import { x } from 'tinyexec'

import { getGitTag } from './getGitTag'
import { tokenizeArgs } from './tokenizeArgs'

describe('getGitTag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the trimmed git tag', async () => {
    vi.mocked(tokenizeArgs).mockReturnValue(['git', 'describe', '--tags', '--exact-match'])

    vi.mocked(x).mockResolvedValue({
      stdout: 'v1.2.3\n',
    } as any)

    const result = await getGitTag()

    expect(result).toBe('v1.2.3')

    expect(tokenizeArgs).toHaveBeenCalledWith('git describe --tags --exact-match')

    expect(x).toHaveBeenCalledWith('git', ['describe', '--tags', '--exact-match'], {
      throwOnError: false,
    })
  })

  it('returns empty string if tokenizeArgs throws', async () => {
    vi.mocked(tokenizeArgs).mockImplementation(() => {
      throw new Error('parse error')
    })

    const result = await getGitTag()

    expect(result).toBe('')
  })

  it('returns empty string if x throws', async () => {
    vi.mocked(tokenizeArgs).mockReturnValue(['git', 'describe', '--tags', '--exact-match'])

    vi.mocked(x).mockRejectedValue(new Error('git failed'))

    const result = await getGitTag()

    expect(result).toBe('')
  })
})
