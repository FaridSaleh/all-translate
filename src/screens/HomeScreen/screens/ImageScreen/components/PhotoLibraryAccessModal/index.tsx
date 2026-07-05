import { useTranslation } from 'react-i18next'
import AccessPermissionModal from '../AccessPermissionModal'
import PhotoLibraryAccessModalProps from './type'

const PhotoLibraryAccessModal = ({
  isOpen,
  setIsOpen,
  onSelectMore,
  onKeepCurrent,
}: PhotoLibraryAccessModalProps) => {
  const { t } = useTranslation()

  return (
    <AccessPermissionModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={t('ImageScreen.photo_library_access.title')}
      description={t('ImageScreen.photo_library_access.description')}
      primaryAction={{
        label: t('ImageScreen.photo_library_access.select_more'),
        onPress: () => {
          setIsOpen(false)
          onSelectMore()
        },
      }}
      secondaryAction={{
        label: t('ImageScreen.photo_library_access.keep_current'),
        onPress: () => {
          setIsOpen(false)
          onKeepCurrent()
        },
      }}
    />
  )
}

export default PhotoLibraryAccessModal
