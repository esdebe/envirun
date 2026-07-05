import { x } from 'tinyexec'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getGitShortSha } from './getGitShortSha'
import { tokenizeArgs } from './tokenizeArgs'

vi.mock('tinyexec', () => ({
  x: vi.fn<() => void>(),
}))

vi.mock('./tokenizeArgs', () => ({
  tokenizeArgs: vi.fn<() => void>(),
}))

describe('getGitShortSha', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the trimmed git sha', async () => {
    vi.mocked(tokenizeArgs).mockReturnValue(['git', 'rev-parse', '--short', 'HEAD'])

    vi.mocked(x).mockResolvedValue({
      stdout: 'abc123\n',
    } as any)

    const result = await getGitShortSha()

    expect(result).toBe('abc123')

    expect(tokenizeArgs).toHaveBeenCalledWith('git rev-parse --short HEAD')

    expect(x).toHaveBeenCalledWith('git', ['rev-parse', '--short', 'HEAD'], { throwOnError: false })
  })

  it('returns empty string if tokenizeArgs throws', async () => {
    vi.mocked(tokenizeArgs).mockImplementation(() => {
      throw new Error('parse error')
    })

    const result = await getGitShortSha()

    expect(result).toBe('')
  })

  it('returns empty string if x throws', async () => {
    vi.mocked(tokenizeArgs).mockReturnValue(['git', 'rev-parse', '--short', 'HEAD'])

    vi.mocked(x).mockRejectedValue(new Error('git failed'))

    const result = await getGitShortSha()

    expect(result).toBe('')
  })
})
