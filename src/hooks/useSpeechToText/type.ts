export default interface UseSpeechToTextDto {
  isListening: boolean
  isAvailable: boolean
  result: string
  setResult: (result: string) => void
  error: string | null
  startListening: (language: string) => Promise<void>
  stopListening: () => Promise<void>
  reset: () => void
  transcriptAvailabilityCheck: (language: string) => boolean
  // isTranscriptAvailable: boolean
}
