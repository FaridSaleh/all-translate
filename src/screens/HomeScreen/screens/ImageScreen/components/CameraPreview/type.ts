export interface CameraPreviewRef {
  takePhoto: () => Promise<string | null>
}

export default interface CameraPreviewProps {
  isFlashlightOn: boolean
  isActive: boolean
}
