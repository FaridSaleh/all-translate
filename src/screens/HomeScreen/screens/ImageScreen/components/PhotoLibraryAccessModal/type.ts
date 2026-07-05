export default interface PhotoLibraryAccessModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSelectMore: () => void
  onKeepCurrent: () => void
}
