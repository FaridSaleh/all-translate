export default interface AccessPermissionModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title: string
  description: string
  primaryAction: {
    label: string
    onPress: () => void
  }
  secondaryAction: {
    label: string
    onPress: () => void
  }
}
