export default interface CameraAccessModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onAllow: () => void
  onDeny: () => void
}
