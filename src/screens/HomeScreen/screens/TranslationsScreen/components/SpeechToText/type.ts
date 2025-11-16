export default interface SpeechToTextProps {
  type: 'source' | 'target'
  show: boolean
  onPress: () => void
  isListening: boolean
  isTranscriptAvailable: boolean
  languageName: string
}
