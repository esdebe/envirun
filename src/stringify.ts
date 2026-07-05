export type Input = Record<string, any>

const jsonValueToEnv = (value: any): string => {
  let processedValue = String(value)
  processedValue = processedValue.replace(/\n/g, '\\n')
  processedValue = processedValue.includes('\\n') ? `"${processedValue}"` : processedValue
  return processedValue
}

export const stringify = (obj: Input): string => {
  let result = ''
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      const line = `${key}=${jsonValueToEnv(value)}`
      result += line + '\n'
    }
  }
  return result
}
