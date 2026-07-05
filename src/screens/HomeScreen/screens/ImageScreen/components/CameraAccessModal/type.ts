export default interface CameraAccessModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onAllow: () => Promise<boolean>
  onDeny: () => void
}
