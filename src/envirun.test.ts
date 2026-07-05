import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@clack/prompts', () => ({
  select: vi.fn<() => void>(),
  isCancel: vi.fn<() => void>(),
}))

vi.mock('./discoverEnv', () => ({
  discoverEnv: vi.fn<() => void>(),
}))

vi.mock('./getGitShortSha', () => ({
  getGitShortSha: vi.fn<() => void>(),
}))

vi.mock('./getGitTag', () => ({
  getGitTag: vi.fn<() => void>(),
}))

vi.mock('./loadEnv', () => ({
  loadEnv: vi.fn<() => void>(),
}))

vi.mock('./runCommand', () => ({
  runCommand: vi.fn<() => void>(),
}))

describe('main', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('runs application with selected env', async () => {
    const { select, isCancel } = await import('@clack/prompts')

    const { discoverEnv } = await import('./discoverEnv')

    const { getGitShortSha } = await import('./getGitShortSha')

    const { getGitTag } = await import('./getGitTag')

    const { loadEnv } = await import('./loadEnv')

    const { runCommand } = await import('./runCommand')

    vi.mocked(select).mockResolvedValueOnce('development').mockResolvedValueOnce('.env/dev.env')

    vi.mocked(isCancel).mockReturnValue(false)

    vi.mocked(discoverEnv).mockResolvedValue(['.env/dev.env'])

    vi.mocked(getGitShortSha).mockResolvedValue('abc123')

    vi.mocked(getGitTag).mockResolvedValue('v1.0.0')

    vi.mocked(loadEnv).mockResolvedValue({
      API_URL: 'http://localhost',
    })

    const { envirun } = await import('./envirun')

    await envirun()

    expect(runCommand).toHaveBeenCalledWith('development', {
      API_URL: 'http://localhost',
      GIT_SHA: 'abc123',
      GIT_TAG: 'v1.0.0',
    })
  })
})
