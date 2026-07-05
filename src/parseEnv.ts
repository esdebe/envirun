export type Data = Record<string, string>

export const unQuote = (str: string) => {
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1)
  }
  return str
}

export const splitInLines = (src: string): string[] => {
  return src
    .replace(/("[\s\S]*?")/g, (_m, cg) => {
      return cg.replace(/\n/g, '%%LINE-BREAK%%')
    })
    .split('\n')
    .filter((i) => Boolean(i.trim()))
    .map((i) => i.replace(/%%LINE-BREAK%%/g, '\n'))
}

export const parseEnv = (src: string): Data => {
  const result: Data = {}

  const lines = splitInLines(src)

  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:]((.|\n)*)/)
    if (match) {
      const key = match[1].trim()
      const value = unQuote(match[2].trim())
      result[key] = value
    }
  }

  return result
}
