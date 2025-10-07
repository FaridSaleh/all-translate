import { Platform } from 'react-native'

export function buildUserAgent() {
  let appVersion = '0.0.1'
  try {
    const pkg = require('../../../package.json')
    if (pkg?.version) appVersion = String(pkg.version)
  } catch {}

  const osType = Platform.OS
  const osVersion = String(Platform.Version)
  const deviceModel =
    // @ts-ignore - not in types, exists at runtime on most platforms
    (Platform as any)?.constants?.Model ||
    // @ts-ignore
    (Platform as any)?.constants?.model ||
    'Unknown'

  return `${appVersion},${osType},${osVersion},${deviceModel}`
}
