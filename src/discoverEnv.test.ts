import fastGlob from 'fast-glob'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { discoverEnv } from './discoverEnv'

vi.mock('fast-glob', () => ({
  default: vi.fn<() => void>(),
}))

describe('discoverEnv', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls fast-glob with the expected options', async () => {
    vi.mocked(fastGlob).mockResolvedValue(['.env/app.env', '.env/test.env'])

    const result = await discoverEnv()

    expect(result).toEqual(['.env/app.env', '.env/test.env'])

    expect(fastGlob).toHaveBeenCalledWith(['.env/*.env'], {
      cwd: process.cwd(),
      onlyFiles: true,
      dot: true,
      ignore: ['**/docker/**', '**/local/**', '**/*docker*', '**/*local*'],
    })
  })

  it('returns an empty array when no files are found', async () => {
    vi.mocked(fastGlob).mockResolvedValue([])

    const result = await discoverEnv()

    expect(result).toEqual([])
  })

  it('rejects when fast-glob fails', async () => {
    vi.mocked(fastGlob).mockRejectedValue(new Error('glob failed'))

    await expect(discoverEnv()).rejects.toThrow('glob failed')
  })
})
