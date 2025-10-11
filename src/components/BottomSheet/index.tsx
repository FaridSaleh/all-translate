import { useCallback, useRef } from 'react'
import GBottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomSheetProps from './type'

const BottomSheet = ({ children, isOpen, setIsOpen }: BottomSheetProps) => {
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<GBottomSheet>(null)

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

  return (
    <GBottomSheet
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      enablePanDownToClose={true}
      onClose={() => setIsOpen(false)}
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={{ paddingBottom: insets.bottom }}>{children}</BottomSheetView>
    </GBottomSheet>
  )
}

export default BottomSheet
