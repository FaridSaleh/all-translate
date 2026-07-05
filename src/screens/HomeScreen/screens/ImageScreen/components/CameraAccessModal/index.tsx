import { useTranslation } from 'react-i18next'
import AccessPermissionModal from '../AccessPermissionModal'
import CameraAccessModalProps from './type'

const CameraAccessModal = ({ isOpen, setIsOpen, onAllow, onDeny }: CameraAccessModalProps) => {
  const { t } = useTranslation()

  return (
    <AccessPermissionModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={t('ImageScreen.camera_access.title')}
      description={t('ImageScreen.camera_access.description')}
      primaryAction={{
        label: t('ImageScreen.camera_access.allow'),
        onPress: () => {
          setIsOpen(false)
          onAllow()
        },
      }}
      secondaryAction={{
        label: t('ImageScreen.camera_access.deny'),
        onPress: () => {
          setIsOpen(false)
          onDeny()
        },
      }}
    />
  )
}

export default CameraAccessModal
