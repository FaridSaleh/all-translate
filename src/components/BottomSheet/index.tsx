import { useCallback, useRef, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import BottomSheetProps from './type'

const BottomSheet = ({ children, isOpen, setIsOpen }: BottomSheetProps) => {
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.72}
        style={{ backgroundColor: '#1B1F26' }}
        pressBehavior="none"
      />
    ),
    [],
  )

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [isOpen])

  return (
    <BottomSheetModal
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      enablePanDownToClose={true}
      onDismiss={() => setIsOpen(false)}
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={{ paddingBottom: insets.bottom }}>{children}</BottomSheetView>
    </BottomSheetModal>
  )
}

export default BottomSheet
