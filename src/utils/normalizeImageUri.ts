const normalizeImageUri = (uri: string): string => {
  if (uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('ph://')) {
    return uri
  }

  return `file://${uri}`
}

export default normalizeImageUri
