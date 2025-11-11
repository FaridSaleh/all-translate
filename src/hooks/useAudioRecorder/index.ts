import { useState, useRef } from 'react'
import { Platform, PermissionsAndroid } from 'react-native'
import Sound from 'react-native-nitro-sound'

interface UseAudioRecorderDto {
  isRecording: boolean
  startRecording: () => void
  stopRecording: () => Promise<string | null>
  reset: () => void
}

const useAudioRecorder = (): UseAudioRecorderDto => {
  const [isRecording, setIsRecording] = useState(false)
  const recordingPathRef = useRef<string | null>(null)

  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      return false
    }
  }

  const startRecording = async () => {
    try {
      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        console.error('Microphone permission denied')
        return null
      }

      const path = await Sound.startRecorder()
      recordingPathRef.current = path
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
      setIsRecording(false)
    }
  }

  const stopRecording = async (): Promise<string | null> => {
    try {
      if (!isRecording) {
        return null
      }

      const path = await Sound.stopRecorder()
      setIsRecording(false)
      recordingPathRef.current = path
      return path
    } catch (error) {
      console.error('Failed to stop recording:', error)
      setIsRecording(false)
      return null
    }
  }

  const reset = () => {
    recordingPathRef.current = null
    setIsRecording(false)
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    reset,
  }
}

export default useAudioRecorder
