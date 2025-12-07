export default interface UseAudioRecorderDto {
  isRecording: boolean
  startRecording: () => void
  stopRecording: () => Promise<string | null>
  reset: () => void
}
