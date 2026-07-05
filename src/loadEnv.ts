import fs from 'node:fs/promises'

import { parseEnv } from './parseEnv'

export const loadEnv = async (path: string): Promise<Record<string, string>> => {
  const content = await fs.readFile(path, 'utf8')

  return parseEnv(content)
}
