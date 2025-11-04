import { NativeModules } from 'react-native'

type ModuleShape = {
  getSupportedLocales: () => Promise<string[]>
}

const { RNSpeechLocales } = NativeModules as { RNSpeechLocales?: ModuleShape }

export async function getSpeechSupportedLocales(): Promise<string[]> {
  if (!RNSpeechLocales) return []
  try {
    const locales = await RNSpeechLocales.getSupportedLocales()
    const normalized = locales
      .filter(Boolean)
      .map(l => String(l).trim())
      .filter(l => l.length > 0)
      .map(l => l.replace('_', '-'))
    return Array.from(new Set(normalized))
  } catch {
    return []
  }
}
